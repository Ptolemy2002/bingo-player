import { omit } from "@ptolemy2002/ts-utils";
import { BingoGame, BingoPlayer, BingoPlayerRole, BingoSpaceSet, cleanMongoSpace, MongoSpace, SocketID, RouteError } from "src";

// Creating partials that still require necessary fields
export type BingoGameInit = Partial<BingoGame> & Pick<BingoGame, "id">;
export type BingoPlayerInit = Partial<BingoPlayer> & Pick<BingoPlayer, "name" | "socketId">;

export class BingoGameData {
    id: string;
    players: BingoPlayerData[] = [];
    spaces: BingoSpaceSet = [];

    constructor(game: BingoGameInit | BingoGameData) {
        if (game instanceof BingoGameData) game = game.toJSON();
        this.id = game.id;
        this.fromJSON(omit(game, "id"));
    }

    getSocketRoomName() {
        return `game(${this.id})`;
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

    getPlayerByName(name: string) {
        const index = this.getPlayerIndexByName(name);
        if (index === -1) return null;
        return this.players[index];
    }

    getPlayerBySocketId(socketId: SocketID) {
        const index = this.getPlayerIndexBySocketId(socketId);
        if (index === -1) return null;
        return this.players[index];
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
            throw new RouteError(`Space ${_space} not found in game "${this.id}"`, 404, "NOT_FOUND");
        }

        return this;
    }

    unmark(_space: string | number) {
        const space = this.getSpace(_space);
        if (space) {
            space.isMarked = false;
        } else {
            throw new RouteError(`Space ${_space} not found in game "${this.id}"`, 404, "NOT_FOUND");
        }

        return this;
    }

    toggleMark(_space: string | number) {
        const space = this.getSpace(_space);
        if (space) {
            space.isMarked = !space.isMarked;
        } else {
            throw new RouteError(`Space ${_space} not found in game "${this.id}"`, 404, "NOT_FOUND");
        }

        return this;
    }

    addSpace(space: MongoSpace) {
        if (this.hasSpace(space._id)) throw new RouteError(`Space ${space._id} already exists in game "${this.id}"`, 409, "CONFLICT");

        const newSpace = {
            isMarked: false,
            spaceData: cleanMongoSpace(space)
        };

        this.spaces.push(newSpace);

        return newSpace;
    }

    updateSpace(space: Partial<MongoSpace> | string | number, data: Partial<BingoSpaceSet[number]>) {
        if (typeof space === "string" || typeof space === "number") {
            const index = this.getSpaceIndex(space);
            if (index === -1) throw new RouteError(`Space ${space} not found in game "${this.id}"`, 404, "NOT_FOUND");
            space = this.spaces[index].spaceData;
        }

        if (space._id && this.hasSpace(space._id)) {
            const index = this.getSpaceIndex(space._id);
            if (data.isMarked !== undefined) this.spaces[index]!.isMarked = data.isMarked;
            if (data.spaceData) this.spaces[index]!.spaceData = { ...this.spaces[index]!.spaceData, ...data.spaceData };
            return this.spaces[index];
        } else {
            throw new RouteError(`Space ${space._id} not found in game "${this.id}"`, 404, "NOT_FOUND");
        }
    }

    removeSpace(space: string | number) {
        const index = this.getSpaceIndex(space);
        if (index !== -1) {
            this.spaces.splice(index, 1);
        } else {
            throw new RouteError(`Space ${space} not found in game "${this.id}"`, 404, "NOT_FOUND");
        }

        return this;
    }

    addPlayer(player: BingoPlayerInit) {
        if (this.hasPlayerByName(player.name)) throw new RouteError(`Player "${player.name}" already exists in game "${this.id}"`, 409, "CONFLICT");
        if (this.hasPlayerBySocketId(player.socketId)) throw new RouteError(`Player with socket ID ${player.socketId} already exists in game "${this.id}"`, 409, "CONFLICT");

        const newPlayer = new BingoPlayerData(player);
        this.players.push(newPlayer);
        return newPlayer;
    }

    updatePlayerByName(name: string, data: Partial<BingoPlayer>) {
        const index = this.getPlayerIndexByName(name);
        if (index === -1) throw new RouteError(`Player "${name}" not found in game "${this.id}"`, 404, "NOT_FOUND");
        
        return this.players[index].fromJSON(data);
    }

    updatePlayerBySocketId(socketId: SocketID, data: Partial<BingoPlayer>) {
        const index = this.getPlayerIndexBySocketId(socketId);
        if (index === -1) throw new RouteError(`Player with socket ID ${socketId} not found in game "${this.id}"`, 404, "NOT_FOUND");
        
        return this.players[index].fromJSON(data);
    }

    addOrUpdatePlayer(player: Partial<BingoPlayer>) {
        if (player.name && this.hasPlayerByName(player.name)) {
            return this.updatePlayerByName(player.name, player);
        } else if (player.socketId && this.hasPlayerBySocketId(player.socketId)) {
            return this.updatePlayerBySocketId(player.socketId, player);
        } else if (player.name && player.socketId) {
            return this.addPlayer(player as BingoPlayerInit); // Type assertion since we know both fields are present
        } else {
            throw new RouteError(`Player must have a name and socket ID to be added to game "${this.id}"`, 400, "BAD_INPUT");
        }
    }

    removePlayerByName(name: string) {
        const index = this.getPlayerIndexByName(name);
        
        if (index !== -1) {
            const player = this.players[index];
            this.players.splice(index, 1);
            return player;
        } else {
            throw new RouteError(`Player "${name}" not found in game "${this.id}"`, 404, "NOT_FOUND");
        }
    }

    removePlayerBySocketId(socketId: SocketID) {
        const index = this.getPlayerIndexBySocketId(socketId);
        

        if (index !== -1) {
            const player = this.players[index];
            this.players.splice(index, 1);
            return player;
        } else {
            throw new RouteError(`Player with socket ID ${socketId} not found in game "${this.id}"`, 404, "NOT_FOUND");
        }
    }

    clone() {
        return new BingoGameData(this.toJSON());
    }
}

export class BingoPlayerData {
    name: string;
    socketId: SocketID;
    role: BingoPlayerRole = "player";

    constructor(player: BingoPlayerInit | BingoPlayerData) {
        if (player instanceof BingoPlayerData) player = player.toJSON();
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

    clone() {
        return new BingoPlayerData(this.toJSON());
    }
}

export class BingoGameCollection {
    static global = new BingoGameCollection();

    private games: Map<BingoGame["id"], BingoGameData> = new Map();

    constructor(games: BingoGameInit[] | BingoGameCollection = []) {
        if (games instanceof BingoGameCollection) games = games.getAllGames();
        games?.forEach((game) => this.addGame(game));
    }

    setGame(game: BingoGameInit) {
        this.games.set(game.id, new BingoGameData(game));
        return this.getGame(game.id)!;
    }

    addGame(game: BingoGameInit | BingoGameData) {
        if (game instanceof BingoGameData) game = game.toJSON();
        if (this.hasGame(game.id)) throw new RouteError(`Game with ID "${game.id}" already exists`, 409, "CONFLICT");
        return this.setGame(game);
    }

    updateGame(game: BingoGameInit | BingoGameData | number) {
        if (typeof game === "number") {
            game = this.getGame(game)!; // Use non-null assertion so that TypeScript lets us assign it - we check for null on the next line
            if (!game) throw new RouteError(`Game with ID "${game}" not found`, 404, "NOT_FOUND");
        } else if (game instanceof BingoGameData) {
            game = game.toJSON();
        }

        if (!this.hasGame(game.id)) throw new RouteError(`Game with ID "${game.id}" not found`, 404, "NOT_FOUND");
        return this.getGame(game.id)!.fromJSON(game);
    }

    addOrUpdateGame(game: BingoGameInit | BingoGameData) {
        if (game instanceof BingoGameData) game = game.toJSON();
        if (this.hasGame(game.id)) {
            return this.updateGame(game);
        } else {
            return this.addGame(game);
        }
    }

    removeGame(gameId: BingoGame["id"] | number) {
        const game = this.getGame(gameId);
        if (game) this.games.delete(game.id);
        return game;
    }

    getGame(gameId: BingoGame["id"] | number) {
        if (typeof gameId === "number") {
            return this.size() > gameId ? this.getAllGames()[gameId]! : null;
        } else {
            return this.games.get(gameId) ?? null;
        }
    }

    getAllGames() {
        return Array.from(this.games.values());
    }

    hasGame(gameId?: BingoGame["id"] | number) {
        if (typeof gameId === "number") {
            return this.size() > gameId;
        } else if (gameId === undefined) {
            return this.size() > 0;
        } else {
            return this.games.has(gameId);
        }
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

    filter(callback: (game: BingoGameData, index: number, collection: BingoGameCollection) => boolean) {
        return new BingoGameCollection(
            this.getAllGames().filter((game, index) => callback(game, index, this))
        );
    }

    clone() {
        return new BingoGameCollection(this);
    }

    *[Symbol.iterator]() {
        yield* this.games
    }
}