import { omit } from "@ptolemy2002/ts-utils";
import { BingoGame, BingoPlayer, BingoPlayerRole, BingoSpaceSet, cleanMongoSpace, MongoSpace, SocketID } from "shared";

// Creating partials that still require necessary fields
export type BingoGameInit = Partial<BingoGame> & Pick<BingoGame, "id">;
export type BingoPlayerInit = Partial<BingoPlayer> & Pick<BingoPlayer, "name" | "socketId">;

export class BingoGameData {
    id: string;
    players: BingoPlayerData[] = [];
    spaces: BingoSpaceSet = [];

    constructor(game: BingoGameInit) {
        this.id = game.id;
        this.fromJSON(omit(game, "id"));
    }

    fromJSON(data: Partial<BingoGame>) {
        if (data.id) this.id = data.id;

        if (data.players) {
            const self = this;
            data.players.forEach(other => {
                const matchingPlayer = self.players[self.getPlayerIndexByName(other.name)];
                if (matchingPlayer) {
                    matchingPlayer.fromJSON(other);
                } else {
                    self.players.push(new BingoPlayerData(other));
                }
            });
        }

        if (data.spaces) {
            // Do a direct override since all space data should be coming from the database and not modified in-place.
            this.spaces = [...data.spaces];
        }

        return this;
    }

    toJSON(): BingoGame {
        return {
            id: this.id,
            players: this.players.map(player => player.toJSON()),
            spaces: [...this.spaces]
        };
    }

    getSpaceIndex(space: string | number) {
        if (typeof space === "string") {
            return this.spaces.findIndex(s => s.spaceData._id === space);
        } else {
            return space;
        }
    }

    hasSpace(space: string | number) {
        return this.getSpaceIndex(space) !== -1;
    }

    getPlayerIndexByName(name: string) {
        return this.players.findIndex(player => player.name === name);
    }

    getPlayerIndexBySocketId(socketId: SocketID) {
        return this.players.findIndex(player => player.socketId === socketId);
    }

    hasPlayerByName(name: string) {
        return this.getPlayerIndexByName(name) !== -1;
    }

    hasPlayerBySocketId(socketId: SocketID) {
        return this.getPlayerIndexBySocketId(socketId) !== -1;
    }

    getSpace(space: string | number) {
        const index = this.getSpaceIndex(space);
        if (index === -1) return null;
        return this.spaces[index];
    }

    mark(_space: string | number) {
        const space = this.getSpace(_space);
        if (space) {
            space.isMarked = true;
        } else {
            throw new Error(`Space ${_space} not found in game "${this.id}"`);
        }

        return this;
    }

    unmark(_space: string | number) {
        const space = this.getSpace(_space);
        if (space) {
            space.isMarked = false;
        } else {
            throw new Error(`Space ${_space} not found in game "${this.id}"`);
        }

        return this;
    }

    toggleMark(_space: string | number) {
        const space = this.getSpace(_space);
        if (space) {
            space.isMarked = !space.isMarked;
        } else {
            throw new Error(`Space ${_space} not found in game "${this.id}"`);
        }

        return this;
    }

    addSpace(space: MongoSpace) {
        if (this.hasSpace(space._id)) throw new Error(`Space ${space._id} already exists in game "${this.id}"`);

        const newSpace = {
            isMarked: false,
            spaceData: cleanMongoSpace(space)
        };

        this.spaces.push(newSpace);

        return newSpace;
    }

    removeSpace(space: string | number) {
        const index = this.getSpaceIndex(space);
        if (index !== -1) {
            this.spaces.splice(index, 1);
        } else {
            throw new Error(`Space ${space} not found in game "${this.id}"`);
        }

        return this;
    }

    addPlayer(player: BingoPlayerInit) {
        if (this.hasPlayerByName(player.name)) throw new Error(`Player "${player.name}" already exists in game "${this.id}"`);
        if (this.hasPlayerBySocketId(player.socketId)) throw new Error(`Player with socket ID ${player.socketId} already exists in game "${this.id}"`);

        const newPlayer = new BingoPlayerData(player);
        this.players.push(newPlayer);
        return newPlayer;
    }

    removePlayerByName(name: string) {
        const index = this.getPlayerIndexByName(name);
        const player = this.players[index];

        if (index !== -1) {
            this.players.splice(index, 1);
        } else {
            throw new Error(`Player "${name}" not found in game "${this.id}"`);
        }

        return player;
    }

    removePlayerBySocketId(socketId: SocketID) {
        const index = this.getPlayerIndexBySocketId(socketId);
        const player = this.players[index];

        if (index !== -1) {
            this.players.splice(index, 1);
        } else {
            throw new Error(`Player with socket ID ${socketId} not found in game "${this.id}"`);
        }

        return player;
    }
}

export class BingoPlayerData {
    name: string;
    socketId: SocketID;
    role: BingoPlayerRole = "player";

    constructor(player: BingoPlayerInit) {
        this.name = player.name;
        this.socketId = player.socketId;
        this.fromJSON(omit(player, "name", "socketId"));
    }

    fromJSON(data: Partial<BingoPlayer>={}) {
        if (data.name) this.name = data.name;
        if (data.socketId) this.socketId = data.socketId;
        if (data.role) this.role = data.role;

        return this;
    }

    toJSON(): BingoPlayer {
        return {
            name: this.name,
            socketId: this.socketId,
            role: this.role
        };
    }
}

export class BingoGameCollection {
    static global = new BingoGameCollection();

    private games: Map<BingoGame["id"], BingoGameData> = new Map();

    constructor(games: BingoGameInit[] = []) {
        games?.forEach((game) => this.addGame(game));
    }

    setGame(game: BingoGameInit) {
        this.games.set(game.id, new BingoGameData(game));
        return this.getGame(game.id)!;
    }

    addGame(game: BingoGameInit) {
        if (this.hasGame(game.id)) throw new Error(`Game with ID "${game.id}" already exists`);
        return this.setGame(game);
    }

    removeGame(gameId: BingoGame["id"]) {
        const game = this.getGame(gameId);
        this.games.delete(gameId);
        return game;
    }

    getGame(gameId: BingoGame["id"]) {
        return this.games.get(gameId) ?? null;
    }

    getAllGames() {
        return Array.from(this.games.values());
    }

    hasGame(gameId?: BingoGame["id"]) {
        if (gameId === undefined) return this.size() > 0;
        return this.games.has(gameId);
    }

    entries() {
        return Array.from(this.games.entries());
    }

    getIds() {
        return Array.from(this.games.keys());
    }

    toJSON(): BingoGame[] {
        return Array.from(this.games.values()).map(game => game.toJSON());
    }

    size() {
        return this.games.size;
    }

    clear() {
        this.games.clear();
        return this;
    }

    forEach(callback: (game: BingoGameData) => void) {
        this.games.forEach((game) => callback(game));
    }

    *[Symbol.iterator]() {
        yield* this.games
    }
}