import { omit, SerializableAdvancedCondition, SerializableValueCondition, serializableValueConditionType, ValueCondition, valueConditionMatches, valueConditionType } from "@ptolemy2002/ts-utils";
import { BingoGame, BingoPlayer, BingoPlayerRole, BingoSpaceSet, cleanMongoSpace, MongoSpace, SocketID, RouteError, BingoBoard, BingoBoardTemplateOutput } from "src";
import ms from "ms";

// Creating partials that still require necessary fields
export type BingoGameInit = Partial<BingoGame> & Pick<BingoGame, "id">;
export type BingoPlayerInit = Partial<BingoPlayer> & Pick<BingoPlayer, "name" | "socketId">;
export type BingoBoardInit = Omit<Partial<BingoBoard> & Pick<BingoBoard, "id" | "shape">, "ownerName" | "gameId">;
export type BingoBoardPartial = Omit<Partial<BingoBoard>, "ownerName" | "gameId"> & { owner?: BingoPlayerData | BingoPlayerInit, game?: BingoGameData | BingoGameInit };

type Coordinate = { x: number, y: number };

export class BingoGameData {
    id: string;
    players: BingoPlayerData[] = [];
    boards: BingoBoardData[] = [];
    boardTemplates: BingoBoardTemplateOutput[] = [];
    spaces: BingoSpaceSet = [];

    activeTimeoutIds: number[] = [];

    constructor(game: BingoGameInit | BingoGameData) {
        if (game instanceof BingoGameData) game = game.toJSON();
        this.id = game.id;
        this.fromJSON(omit(game, "id"));
    }

    clearTimeout(id: number, skipCancel: boolean = false, debug: boolean = false) {
        if (!skipCancel) clearTimeout(id);
        this.activeTimeoutIds = this.activeTimeoutIds.filter(activeId => activeId !== id);
        if (debug) console.log(`Cleared timeout [${id}] for game [${this.id}]`);
        return this;
    }

    clearTimeouts(skipCancel: boolean = false, debug: boolean = false) {
        this.activeTimeoutIds.forEach(id => this.clearTimeout(id, skipCancel));
        if (debug) console.log(`Cleared all active timeouts for game [${this.id}]`);
        return this;
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

        if (data.boards) {
            const self = this;
            data.boards.forEach(other => {
                const matchingBoard = self.boards[self.boards.findIndex(b => b.id === other.id)];
                if (matchingBoard) {
                    matchingBoard.fromJSON(other);
                } else {
                    self.addBoard(other, self.getPlayerByName(other.ownerName)!);
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
            boards: this.boards.map(board => board.toJSON()),
            boardTemplates: [...this.boardTemplates],
            spaces: this.spaces.map(space => ({
                isMarked: space.isMarked,
                spaceData: { ...space.spaceData }
            }))
        };
    }

    getSpaceIndex(space: string | number) {
        if (typeof space === "string") {
            return this.spaces.findIndex(s => s.spaceData._id === space);
        } else if (space >= this.spaces.length || space < 0) {
            return -1;
        } else {
            return space;
        }
    }

    getBoardIndex(boardId: string | number) {
        if (typeof boardId === "string") {
            return this.boards.findIndex(b => b.id === boardId);
        } else if (boardId >= this.boards.length || boardId < 0) {
            return -1;
        } else {
            return boardId;
        }
    }

    getBoardTemplateIndex(templateId: string | number) {
        if (typeof templateId === "string") {
            return this.boardTemplates.findIndex(t => t.id === templateId);
        } else if (templateId >= this.boardTemplates.length || templateId < 0) {
            return -1;
        } else {
            return templateId;
        }
    }

    hasSpace(space: string | number) {
        return this.getSpaceIndex(space) !== -1;
    }

    hasBoard(boardId: string | number) {
        return this.getBoardIndex(boardId) !== -1;
    }

    hasBoardTemplate(templateId: string | number) {
        return this.getBoardTemplateIndex(templateId) !== -1;
    }

    getPlayerIndexByName(name: string) {
        return this.players.findIndex(player => player.name === name);
    }

    getPlayerIndexBySocketId(socketId?: SocketID) {
        if (!socketId) return -1;
        return this.players.findIndex(player => player.socketId === socketId);
    }

    getPlayerByName(name: string) {
        const index = this.getPlayerIndexByName(name);
        if (index === -1) return null;
        return this.players[index];
    }

    getPlayerBySocketId(socketId?: SocketID) {
        const index = this.getPlayerIndexBySocketId(socketId);
        if (index === -1) return null;
        return this.players[index];
    }

    hasPlayerByName(name: string) {
        return this.getPlayerIndexByName(name) !== -1;
    }

    hasPlayerBySocketId(socketId?: SocketID) {
        return this.getPlayerIndexBySocketId(socketId) !== -1;
    }

    getSpace(space: string | number) {
        const index = this.getSpaceIndex(space);
        if (index === -1) return null;
        return this.spaces[index];
    }

    getBoard(boardId: string | number) {
        const index = this.getBoardIndex(boardId);
        if (index === -1) return null;
        return this.boards[index];
    }

    getBoardTemplate(templateId: string | number) {
        const index = this.getBoardTemplateIndex(templateId);
        if (index === -1) return null;
        return this.boardTemplates[index];
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

    addPlayer(player: BingoPlayerInit | BingoPlayerData) {
        if (this.hasPlayerByName(player.name)) throw new RouteError(`Player "${player.name}" already exists in game "${this.id}"`, 409, "CONFLICT");
        if (this.hasPlayerBySocketId(player.socketId)) throw new RouteError(`Player with socket ID ${player.socketId} already exists in game "${this.id}"`, 409, "CONFLICT");

        const newPlayer = player instanceof BingoPlayerData ? player : new BingoPlayerData(player);
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

    removeBoardsByOwnerName(name: string) {
        const removedBoards = this.boards.filter(board => board.owner.name === name);
        this.boards = this.boards.filter(board => board.owner.name !== name);
        return removedBoards;
    }

    removeBoardsByOwnerSocketId(socketId?: SocketID) {
        const owner = this.getPlayerBySocketId(socketId);
        if (!owner) throw new RouteError(`Player with socket ID ${socketId} not found in game "${this.id}"`, 404, "NOT_FOUND");

        return this.removeBoardsByOwnerName(owner.name);
    }

    removeBoardsWithGracePeriod(ownerName: string, delay: number = 0, debug: boolean = false) {
        // Assumed to be called after a player is removed from the game, otherwise it's pointless.
        // Give the player some time to potentially rejoin before removing their boards
        // If a new player with the same name doesn't join in time (the socket ID will be different),
        // remove the boards
        const run = () => {
            const exists = this.hasPlayerByName(ownerName);
            if (!exists) {
                if (debug) console.log(`Removing boards for player [${ownerName}] from game [${this.id}] after grace period of ${ms(delay)}, as they did not reconnect.`);
                this.removeBoardsByOwnerName(ownerName);
            } else {
                if (debug) console.log(`Not removing boards for player [${ownerName}] from game [${this.id}] as they have reconnected.`);
            }
        };

        if (debug) {
            if (delay === 0) {
                console.log(`Player [${ownerName}] boards will be removed from game [${this.id}] immediately.`);
            } else {
                console.log(`Player [${ownerName}] boards will be removed from game [${this.id}] in ${ms(delay)} if they do not reconnect before then.`);
            }
        }

        const boardsToRemove = this.boards.filter(board => board.owner.name === ownerName);

        if (delay === 0) {
            run();
            return [boardsToRemove, null] as const;
        } else {
            const timerId = setTimeout(() => {
                run();
                this.clearTimeout(timerId, true);
            }, delay);
            this.activeTimeoutIds.push(timerId);
            return [boardsToRemove, timerId] as const;
        }
    }

    removePlayerByName(name: string, boardRemoveDelay: number = 0, boardRemoveDebug: boolean = false) {
        const index = this.getPlayerIndexByName(name);
        
        if (index !== -1) {
            const player = this.players[index];
            this.players.splice(index, 1);
            this.removeBoardsWithGracePeriod(name, boardRemoveDelay, boardRemoveDebug);
            return player;
        } else {
            throw new RouteError(`Player "${name}" not found in game "${this.id}"`, 404, "NOT_FOUND");
        }
    }

    removePlayerBySocketId(socketId?: SocketID, boardRemoveDelay: number = 0, boardRemoveDebug: boolean = false) {
        const index = this.getPlayerIndexBySocketId(socketId);

        if (index !== -1) {
            const player = this.players[index];
            this.players.splice(index, 1);
            this.removeBoardsWithGracePeriod(player.name, boardRemoveDelay, boardRemoveDebug);
            return player;
        } else {
            throw new RouteError(`Player with socket ID ${socketId} not found in game "${this.id}"`, 404, "NOT_FOUND");
        }
    }

    addBoard(board: BingoBoardInit | BingoBoardData, owner: BingoPlayerData) {
        if (board instanceof BingoBoardData) board = board.toJSON();
        if (this.hasBoard(board.id)) throw new RouteError(`Board with ID "${board.id}" already exists in game "${this.id}"`, 409, "CONFLICT");

        const newBoard = new BingoBoardData(this, owner, board);
        this.boards.push(newBoard);
        return newBoard;
    }

    updateBoard(boardId: string | number, data: BingoBoardPartial) {
        const board = this.getBoard(boardId);
        if (!board) throw new RouteError(`Board with ID "${boardId}" not found in game "${this.id}"`, 404, "NOT_FOUND");

        return board.fromJSON(data);
    }

    addOrUpdateBoard(board: BingoBoardPartial, owner: BingoPlayerData) {
        if (board.id && this.hasBoard(board.id)) {
            return this.updateBoard(board.id, board);
        } else if (board.id) {
            return this.addBoard(board as BingoBoardInit, owner); // Type assertion since we know ID is present
        } else {
            throw new RouteError(`Board must have an ID to be added to game "${this.id}"`, 400, "BAD_INPUT");
        }
    }

    removeBoard(boardId: string | number) {
        const index = this.getBoardIndex(boardId);
        if (index !== -1) {
            const board = this.boards[index];
            this.boards.splice(index, 1);
            return board;
        } else {
            throw new RouteError(`Board with ID "${boardId}" not found in game "${this.id}"`, 404, "NOT_FOUND");
        }
    }

    addBoardTemplate(template: BingoBoardTemplateOutput) {
        if (this.hasBoardTemplate(template.id)) throw new RouteError(`Board template with ID "${template.id}" already exists in game "${this.id}"`, 409, "CONFLICT");
        this.boardTemplates.push(template);
        return template;
    }

    removeBoardTemplate(templateId: string | number) {
        const index = this.getBoardTemplateIndex(templateId);
        if (index !== -1) {
            const template = this.boardTemplates[index];
            this.boardTemplates.splice(index, 1);
            return template;
        } else {
            throw new RouteError(`Board template with ID "${templateId}" not found in game "${this.id}"`, 404, "NOT_FOUND");
        }
    }

    clone() {
        return new BingoGameData(this.toJSON());
    }

    private getSpacesByTagCondition(tagCondition: ValueCondition<string>) {
        const matchingSpaces: BingoSpaceSet = [];
        this.spaces.forEach((space) => {
            if (space.spaceData.tags.some(tag => valueConditionMatches(tag, tagCondition))) {
                matchingSpaces.push(space);
            }
        });

        return matchingSpaces;
    }

    private countSpacesByTagCondition(tagCondition: ValueCondition<string>) {
        return this.getSpacesByTagCondition(tagCondition).length;
    }

    private countKeyOccurrencesInGrid(grid: string[], keyEntry: string): number {
        let count = 0;
        for (const row of grid) {
            for (const cell of row) {
                if (cell === keyEntry) count++;
            }
        }
        return count;
    }

    async fetchSpacesBasedOnCondition(
        condition: SerializableValueCondition<string>,
        count: number,
        fetchWithTags: (includedTags: string[] | undefined, excludedTags: string[], excludedIds: string[], count: number) => Promise<MongoSpace[]>,
        numFetched=0
    ): Promise<MongoSpace[]> {
        const conditionType = serializableValueConditionType(condition);
        const alreadyCollected = this.getSpacesByTagCondition(condition).map(s => s.spaceData._id);

        let result: MongoSpace[] = [];

        if (conditionType === "value") {
            result = await fetchWithTags([condition as string], [], alreadyCollected, count - numFetched);
            numFetched += result.length;
        } else if (conditionType === "advanced") {
            const advCondition = condition as SerializableAdvancedCondition<string>;
            let include: string[] | undefined = undefined;
            let exclude: string[] = [];

            // We're skipping any instance of `false` in both of these arrays, as that indicates
            // a condition that should never match anything.
            if (Array.isArray(advCondition.include)) {
                include = advCondition.include.filter((i): i is string => i !== false);
                if (include.length === 0) include = undefined;
            } else if (advCondition.include) {
                if (!include) include = [];
                include.push(advCondition.include);
                if (include.length === 0) include = undefined;
            }

            if (Array.isArray(advCondition.exclude)) {
                exclude = advCondition.exclude.filter((e): e is string => e !== false);
            } else if (advCondition.exclude) {
                exclude.push(advCondition.exclude);
            }

            result = await fetchWithTags(include, exclude, alreadyCollected, count - numFetched);
            numFetched += result.length;
        } else if (Array.isArray(conditionType)) {
            const arrayCondition = condition as (SerializableValueCondition<string> | false)[];

            // Collect all the value conditions and get them in one go.
            // The reason we can modify execution order like this is that
            // ValueCondition is designed to be a filter, not an ordered request.
            const valueConditions = arrayCondition.filter(
                (c): c is string => Boolean(c) && valueConditionType(c) === "value"
            );

            if (valueConditions.length > 0) {
                const spaces = await fetchWithTags(valueConditions, [], alreadyCollected, count - numFetched);
                result.push(...spaces);
                numFetched += spaces.length;
            }

            // Recursively fetch for each other condition enclosed
            const otherConditions: SerializableValueCondition<string>[] =arrayCondition.filter(
                (c): c is Exclude<typeof arrayCondition[number], false> => Boolean(c) && serializableValueConditionType(c) !== "value"
            );

            for (const subCondition of otherConditions) {
                const subResult = await this.fetchSpacesBasedOnCondition(subCondition, count, fetchWithTags, numFetched);
                result.push(...subResult);
                numFetched += subResult.length;
            }
        }

        return result;
    }

    private determineSpaceRequirements(template: BingoBoardTemplateOutput) {
        type TagBasedNeed = { condition: SerializableValueCondition<string>, count: number, totalRequired: number };

        const exactNeeded: string[] = [];
        const othersNeeded: Record<string, TagBasedNeed> = {};

        for (const keyEntry of Object.keys(template.key)) {
            const keyDef = template.key[keyEntry];
            if (keyDef.type === "exact") {
                if (!this.hasSpace(keyDef.id)) exactNeeded.push(keyDef.id);
            } else if (keyDef.type === "byTag") {
                const condition = keyDef.condition;
                const existingCount = this.countSpacesByTagCondition(condition);
                const totalRequired = this.countKeyOccurrencesInGrid(template.grid, keyEntry);
                const neededCount = totalRequired - existingCount;

                if (neededCount > 0) {
                    othersNeeded[keyEntry] = { condition, count: neededCount, totalRequired };
                }
            }
        }

        return { exactNeeded, othersNeeded };
    }

    private async fetchRequiredSpaces(
        exactNeeded: string[],
        othersNeeded: Record<string, { condition: SerializableValueCondition<string>, count: number, totalRequired: number }>,
        template: BingoBoardTemplateOutput,
        fetchExactSpaces: (exactSpaceIds: string[]) => Promise<MongoSpace[]>,
        fetchWithTags: (includedTags: string[] | undefined, excludedTags: string[], excludedIds: string[], count: number) => Promise<MongoSpace[]>,
        freeTags: string[] = []
    ) {
        if (exactNeeded.length > 0) {
            const fetchedExactSpaces = await fetchExactSpaces(exactNeeded);
            for (const space of fetchedExactSpaces) {
                this.addSpace(space);
            }
        }

        if (Object.keys(othersNeeded).length > 0) {
            for (const keyEntry of Object.keys(othersNeeded)) {
                const { condition, count } = othersNeeded[keyEntry];
                const keyDef = template.key[keyEntry];

                let spaces = await this.fetchSpacesBasedOnCondition(condition, count, fetchWithTags);

                if (keyDef.type === "byTag" && keyDef.shuffle) {
                    spaces = spaces.sort(() => Math.random() - 0.5);
                }

                for (const space of spaces) {
                    this.addSpace(space);
                    // Spaces with these tags are marked automatically upon board generation
                    if (space.tags?.some(t => freeTags.includes(t))) this.mark(space._id);
                }
            }
        }
    }

    private getSpaceIndicesForCondition(condition: SerializableValueCondition<string>): number[] {
        const matchingSpaces = this.getSpacesByTagCondition(condition);
        return matchingSpaces.map(s => {
            const idx = this.getSpaceIndex(s.spaceData._id);
            if (idx === -1) {
                throw new RouteError(
                    `Space "${s.spaceData._id}" not found in game "${this.id}" despite being in getSpacesByTagCondition result.`,
                    500, "INTERNAL"
                );
            }
            return idx;
        });
    }

    private buildBoardSpacesFromTemplate(
        template: BingoBoardTemplateOutput,
        templateId: string | number,
        othersNeeded: Record<string, { condition: SerializableValueCondition<string>, count: number, totalRequired: number }>
    ): (number | null)[] {
        const boardSpaces: (number | null)[] = [];
        const matchingSpacesStore: Record<string, number[]> = {};

        for (const row of template.grid) {
            for (const cell of row) {
                if (cell === " ") {
                    // Consider a space as a blank/null.
                    // This will effectively just be a hole
                    // in the board ultimately.
                    boardSpaces.push(null);
                    continue;
                }

                const keyDef = template.key[cell];
                if (keyDef.type === "exact") {
                    const spaceIndex = this.getSpaceIndex(keyDef.id);
                    if (spaceIndex === -1) {
                        throw new RouteError(
                            `Failed to find exact space "${keyDef.id}" for board template "${templateId}" in game "${this.id}" after fetching.`,
                            500, "INTERNAL"
                        );
                    }
                    boardSpaces.push(spaceIndex);
                } else if (keyDef.type === "byTag") {
                    const condition = keyDef.condition;
                    if (!matchingSpacesStore[cell]) {
                        matchingSpacesStore[cell] = this.getSpaceIndicesForCondition(condition);
                    }

                    if (matchingSpacesStore[cell].length === 0) {
                        const need = othersNeeded[cell];
                        const currentCount = this.countSpacesByTagCondition(condition);
                        const required = need?.totalRequired ?? currentCount;
                        throw new RouteError(
                            `Failed to find enough spaces matching condition for key "${cell}" for board template "${templateId}" in game "${this.id}" after fetching.`
                            + ` Found ${currentCount}/${required} required.`,
                            500, "INTERNAL"
                        );
                    }

                    // Select a random space then remove it from the store so we don't reuse it
                    const randomIdx = Math.floor(Math.random() * matchingSpacesStore[cell].length);
                    const selectedIndex = matchingSpacesStore[cell][randomIdx];
                    matchingSpacesStore[cell].splice(randomIdx, 1);
                    boardSpaces.push(selectedIndex);
                }
            }
        }

        return boardSpaces;
    }

    async buildBoardFromTemplate(
        id: string,
        templateId: string | number,
        owner: string | BingoPlayerData,

        // These will be provided by the caller to fetch spaces as needed.
        // The caller will deal with it (possibly by throwing an error)
        // if there aren't enough spaces to fulfill the request.
        fetchExactSpaces: (exactSpaceIds: string[]) => Promise<MongoSpace[]>,
        fetchWithTags: (includedTags: string[] | undefined, excludedTags: string[], excludedIds: string[], count: number) => Promise<MongoSpace[]>,

        freeTags: string[] = []
    ) {
        const template = this.getBoardTemplate(templateId);
        if (!template) throw new RouteError(`Board template with ID "${templateId}" not found in game "${this.id}"`, 404, "NOT_FOUND");

        const ownerPlayer = typeof owner === "string" ? this.getPlayerByName(owner) : owner;
        if (!ownerPlayer) throw new RouteError(`Player "${owner}" not found in game "${this.id}"`, 404, "NOT_FOUND");

        const { exactNeeded, othersNeeded } = this.determineSpaceRequirements(template);
        await this.fetchRequiredSpaces(exactNeeded, othersNeeded, template, fetchExactSpaces, fetchWithTags, freeTags);
        const boardSpaces = this.buildBoardSpacesFromTemplate(template, templateId, othersNeeded);

        return this.addBoard({
            id,
            shape: template.shape,
            spaces: boardSpaces,
        }, ownerPlayer);
    }
}

export class BingoPlayerData {
    game: BingoGameData | null = null;
    name: string;
    socketId?: SocketID;
    role: BingoPlayerRole = "player";

    constructor(player: BingoPlayerInit | BingoPlayerData, game: BingoGameInit | BingoGameData | null = null) {
        if (player instanceof BingoPlayerData) player = player.toJSON();
        this.name = player.name;
        this.socketId = player.socketId;

        if (game) {
            this.transferToGame(game);
        }

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

    hasGame() {
        return this.game !== null;
    }

    leaveGame() {
        if (!this.hasGame()) throw new RouteError(`Player "${this.name}" is not in a game`, 400, "BAD_INPUT");
        this.game!.removePlayerBySocketId(this.socketId);
        this.game = null;
        return this;
    }

    transferToGame(game: BingoGameInit | BingoGameData) {
        if (this.hasGame()) {
            this.leaveGame();
        }

        this.game = game instanceof BingoGameData ? game : new BingoGameData(game);
        this.game.addPlayer(this);
        return this;
    }

    makeBoard(board: BingoBoardInit | BingoBoardData) {
        if (!this.hasGame()) throw new RouteError(`Player "${this.name}" is not in a game`, 400, "BAD_INPUT");
        return this.game!.addBoard(board, this);
    }

    removeBoard(boardId: string | number) {
        if (!this.hasGame()) throw new RouteError(`Player "${this.name}" is not in a game`, 400, "BAD_INPUT");
        const board = this.game!.getBoard(boardId);
        if (!board) throw new RouteError(`Board with ID "${boardId}" not found in game "${this.game!.id}"`, 404, "NOT_FOUND");
        if (board.owner.socketId !== this.socketId) throw new RouteError(`Player "${this.name}" does not own board with ID "${boardId}" in game "${this.game!.id}"`, 403, "FORBIDDEN");
        return this.game!.removeBoard(boardId);
    }

    removeBoards() {
        if (!this.hasGame()) throw new RouteError(`Player "${this.name}" is not in a game`, 400, "BAD_INPUT");
        return this.game!.removeBoardsByOwnerSocketId(this.socketId);
    }

    getBoards() {
        if (!this.hasGame()) throw new RouteError(`Player "${this.name}" is not in a game`, 400, "BAD_INPUT");
        return this.game!.boards.filter(board => board.owner.socketId === this.socketId);
    }
}

export class BingoBoardData {
    id: string;
    owner: BingoPlayerData;
    game: BingoGameData;
    _shape: {
        width: number;
        height: number;
    };
    _spaces: (number | null)[] = [];

    get spaces() {
        return this._spaces;
    }

    set spaces(value: (number | null)[]) {
        if (value.length !== this.size()) throw new RouteError(`Board spaces size must be equal to width * height (${this.size()}). Not ${value.length}`, 400, "BAD_INPUT");
        this._spaces = value;
    }

    get shape() {
        return this._shape;
    }

    set shape(value: BingoBoard["shape"]) {
        if (value.width <= 0 || value.height <= 0) throw new RouteError("Board width and height must be positive integers", 400, "BAD_INPUT");
        this._shape = value;

        // Fill spaces with nulls where necessary
        if (this.spaces.length < this.size()) {
            this.spaces = [...this.spaces, ...Array(this.size() - this.spaces.length).fill(null)];
        }
        // Trim spaces where necessary
        else if (this.spaces.length > this.size()) {
            this.spaces = this.spaces.slice(0, this.size());
        }
    }

    constructor(game: BingoGameData, owner: BingoPlayerData, board: BingoBoardInit | BingoBoardData) {
        this.game = game;
        this.owner = owner;

        if (board instanceof BingoBoardData) {
            board = board.toJSON();
        }

        this.fromJSON(board);
    }

    fromJSON(data: BingoBoardPartial) {
        if (data.id) this.id = data.id;
        if (data.shape) this.shape = data.shape;
        if (data.spaces) this.spaces = data.spaces;

        if (data.owner) {
            this.owner = data.owner instanceof BingoPlayerData ? data.owner : new BingoPlayerData(data.owner);
        }

        if (data.game) {
            this.game = data.game instanceof BingoGameData ? data.game : new BingoGameData(data.game);
        }

        return this;
    }

    toJSON(): BingoBoard {
        return {
            id: this.id,
            ownerName: this.owner.name,
            gameId: this.game.id,
            shape: this.shape,
            spaces: this.spaces
        };
    }

    clone() {
        return new BingoBoardData(this.game, this.owner, this.toJSON());
    }

    get width() {
        return this.shape.width;
    }

    get height() {
        return this.shape.height;
    }

    size() {
        return this.width * this.height;
    }

    coordinateToIndex({x, y}: Coordinate) {
        return y * this.width + x;
    }

    indexToCoordinate(index: number) {
        const x = index % this.width;
        const y = Math.floor(index / this.width);
        return { x, y };
    }

    hasSpace(v: number | Coordinate) {
        let index: number;
        if (typeof v === "number") {
            index = v;
        } else {
            index = this.coordinateToIndex(v);
        }
        
        return index >= 0 && index < this.size();
    }

    getSpaceRef(v: number | Coordinate) {
        let index: number;
        if (typeof v === "number") {
            index = v;
        } else {
            index = this.coordinateToIndex(v);
        }

        if (!this.hasSpace(v)) throw new RouteError(`Space index ${index} is out of bounds for board "${this.id}" in game "${this.game.id}"`, 400, "BAD_INPUT");
        return index;
    }

    getSpace(v: number | Coordinate) {
        const index = this.getSpaceRef(v);
        const ref = this.spaces[index];
        if (ref === null) return null;
        return this.game.getSpace(ref);
    }

    setSpace(v: number | Coordinate, space: string | number | null) {
        const index = this.getSpaceRef(v);
        if (space === null) {
            this.spaces[index] = null;
        } else {
            const spaceIndex = this.game.getSpaceIndex(space);
            if (spaceIndex === -1) throw new RouteError(`Space [${space}] not found in game [${this.game.id}]`, 404, "NOT_FOUND");
            this.spaces[index] = spaceIndex;
        }
        return this;
    }

    remove() {
        this.game.removeBoard(this.id);
        return this;
    }
}

export class BingoGameCollection {
    static global = new BingoGameCollection();

    private games: Map<BingoGame["id"], BingoGameData> = new Map();

    constructor(games: BingoGameInit[] | BingoGameCollection = []) {
        if (games instanceof BingoGameCollection) games = games.getAllGames().map(g => g.toJSON());
        games?.forEach((game) => this.addGame(game));
    }

    setGame(game: BingoGameInit) {
        this.games.set(game.id, new BingoGameData(game));
        return this.getGame(game.id)!;
    }

    addGame(game: BingoGameInit | BingoGameData) {
        if (game instanceof BingoGameData) game = game.toJSON();
        if (this.hasGame(game.id)) throw new RouteError(`Game with ID [${game.id}] already exists`, 409, "CONFLICT");
        return this.setGame(game);
    }

    updateGame(game: BingoGameInit | BingoGameData | number) {
        if (typeof game === "number") {
            game = this.getGame(game)!; // Use non-null assertion so that TypeScript lets us assign it - we check for null on the next line
            if (!game) throw new RouteError(`Game with index [${game}] not found`, 404, "NOT_FOUND");
        } else if (game instanceof BingoGameData) {
            game = game.toJSON();
        }

        if (!this.hasGame(game.id)) throw new RouteError(`Game with ID [${game.id}] not found`, 404, "NOT_FOUND");
        return this.getGame(game.id)!.fromJSON(game instanceof BingoGameData ? game.toJSON() : game);
    }

    addOrUpdateGame(game: BingoGameInit | BingoGameData) {
        if (game instanceof BingoGameData) game = game.toJSON();
        if (this.hasGame(game.id)) {
            return this.updateGame(game);
        } else {
            return this.addGame(game);
        }
    }

    removeGame(gameId: BingoGame["id"] | number, cleanup: boolean = true, debug: boolean = false) {
        const game = this.getGame(gameId);
        if (game) {
            if (cleanup) {
                game.clearTimeouts(false, debug);
            }
            
            this.games.delete(game.id);
        }
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
            this.getAllGames().filter((game, index) => callback(game, index, this)).map(g => g.toJSON())
        );
    }

    clone() {
        return new BingoGameCollection(this);
    }

    *[Symbol.iterator]() {
        yield* this.games
    }
}