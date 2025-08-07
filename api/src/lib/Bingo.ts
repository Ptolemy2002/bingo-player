import { BingoGame, BingoPlayer, BingoPlayerRole, BingoSpaceSet, cleanMongoSpace, MongoSpace, SocketID } from "shared";

class BingoGameData {
    id: string;
    players: BingoPlayerData[] = [];
    spaces: BingoSpaceSet = [];

    constructor(game: BingoGame) {
        this.id = game.id;
        this.players = game.players.map(player => new BingoPlayerData(player));
        this.spaces = [...game.spaces];
    }

    fromJSON(data: Partial<BingoGame>) {
        if (data.id) this.id = data.id;

        if (data.players) {
            const self = this;
            data.players.forEach(other => {
                const matchingPlayer = self.players.find(p => p.name === other.name);
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
            throw new Error(`Space ${_space} not found in game ${this.id}`);
        }

        return this;
    }

    unmark(_space: string | number) {
        const space = this.getSpace(_space);
        if (space) {
            space.isMarked = false;
        } else {
            throw new Error(`Space ${_space} not found in game ${this.id}`);
        }

        return this;
    }

    toggleMark(_space: string | number) {
        const space = this.getSpace(_space);
        if (space) {
            space.isMarked = !space.isMarked;
        } else {
            throw new Error(`Space ${_space} not found in game ${this.id}`);
        }

        return this;
    }

    addSpace(space: MongoSpace) {
        this.spaces.push({
            isMarked: false,
            spaceData: cleanMongoSpace(space)
        });

        return this;
    }

    removeSpace(space: string | number) {
        const index = this.getSpaceIndex(space);
        if (index !== -1) {
            this.spaces.splice(index, 1);
        } else {
            throw new Error(`Space ${space} not found in game ${this.id}`);
        }

        return this;
    }
}

class BingoPlayerData {
    name: string = "Unknown";
    socketId: SocketID;
    role: BingoPlayerRole = "player";

    constructor(player: BingoPlayer) {
        this.name = player.name;
        this.socketId = player.socketId;
        this.role = player.role;
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

class BingoGameCollection {
    private games: Map<BingoGame["id"], BingoGameData> = new Map();

    constructor(games?: BingoGame[]) {
        games?.forEach(game => this.addGame(game));
    }

    addGame(game: BingoGame) {
        this.games.set(game.id, new BingoGameData(game));
        return this;
    }

    removeGame(gameId: BingoGame["id"]) {
        this.games.delete(gameId);
        return this;
    }

    getGame(gameId: BingoGame["id"]) {
        return this.games.get(gameId) ?? null;
    }

    getAllGames() {
        return Array.from(this.games.values());
    }

    hasGame(gameId: BingoGame["id"]) {
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