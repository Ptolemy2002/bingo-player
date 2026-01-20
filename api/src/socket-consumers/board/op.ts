import SocketRouteHandler, { SocketRouteHandlerRequestData } from "lib/SocketRouteHandler";
import SpaceModel from "models/SpaceModel";
import { SocketConsumer } from "services/socket";
import { SocketBoardOpSuccessResponse, SocketBoardOpEventName, ZodSocketBoardOpArgsSchema, BingoGameCollection, RouteError, BingoBoardData } from "shared";

export class BingoBoardOpHandler extends SocketRouteHandler<SocketBoardOpSuccessResponse> {
    constructor() {
        super(SocketBoardOpEventName);
    }

    async generateResponse(req: SocketRouteHandlerRequestData) {
        const { success: argsSuccess, data: args, error: argsError} = ZodSocketBoardOpArgsSchema.safeParse(req.args);

        if (!argsSuccess) {
            return {
                status: 400,
                response: this.buildZodErrorResponse(argsError, "BAD_INPUT", {
                    prefix: "args"
                })
            };
        }

        const { gameId, op, boards, template: templateName } = args;

        if (!BingoGameCollection.global.hasGame(gameId)) {
            return {
                status: 404,
                response: this.buildNotFoundResponse(`Game with ID "${gameId}" does not exist`)
            };
        }

        const game = BingoGameCollection.global.getGame(gameId)!;
        const player = game.getPlayerBySocketId(req.id);

        if (!player) {
            return {
                status: 403,
                response: this.buildErrorResponse("FORBIDDEN", "Only players currently in the game can perform board operations")
            };
        }

        if (player.role === "spectator") {
            return {
                status: 403,
                response: this.buildErrorResponse("FORBIDDEN", "Spectators are not allowed to perform board operations")
            };
        }

        const prevGameState = game.toJSON();

        // Necessary because if an error occurs midway through processing the board operation, we should
        // act as if the entire operation never happened to avoid side effects
        function revertGameState() {
            return game.fromJSON(prevGameState);
        }

        const boardsTouched: BingoBoardData[] = [];
        const prevSpacesLength = game.spaces.length;

        for (const boardId of boards) {
            if (op !== "add" && !game.hasBoard(boardId)) {
                revertGameState();
                return {
                    status: 404,
                    response: this.buildNotFoundResponse(`Board with ID "${boardId}" does not exist in game "${gameId}"`)
                };
            }

            try {
                switch (op) {
                    case "add": {
                        if (!templateName) {
                            // Should never be reached, as Zod should catch this
                            revertGameState();
                            return {
                                status: 400,
                                response: this.buildErrorResponse("BAD_INPUT", "Template name must be provided when adding a board")
                            };
                        }

                        boardsTouched.push(await game.buildBoardFromTemplate(
                            boardId, templateName, player,
                            async (ids) => {
                                const spaces = await SpaceModel.find({ _id: { $in: ids } }).limit(ids.length).exec();
                                const res = spaces.map(s => s.toClientJSON());
                                if (res.length < ids.length) {
                                    throw new RouteError(
                                        `Found only ${res.length} spaces, but ${ids.length} were required for board generation`,
                                        500,
                                        "INTERNAL",
                                        this.help
                                    )
                                }

                                return res;
                            },

                            async (includedTags, excludedTags, excludedIds, count) => {
                                const spaces = await SpaceModel.find({
                                    _id: { $nin: excludedIds },
                                    $and: [
                                        { tags: { $in: includedTags } },
                                        { tags: { $nin: excludedTags } }
                                    ]
                                }).limit(count).exec();

                                const res = spaces.map(s => s.toClientJSON());
                                if (res.length < count) {
                                    throw new RouteError(
                                        `Found only ${res.length} spaces, but ${count} were required for board generation`,
                                        500,
                                        "INTERNAL",
                                        this.help
                                    )
                                }

                                return res;
                            }
                        ));
                        break;
                    }

                    case "remove": {
                        boardsTouched.push(game.removeBoard(boardId));
                        break;
                    }
                }
            } catch (e) {
                // This should be a RouteError, which can be rethrown and handled by the root level error handler
                // If it's not, the handler will find what it can from the error object and report it back to the client
                revertGameState();
                throw e;
            }
        }

        if (game.spaces.length > prevSpacesLength) {
            req.socket.to(game.getSocketRoomName()).emit("spacesChange", {
                op: "add",
                spaces: game.spaces.slice(prevSpacesLength).map(s => s.spaceData),
                gameId
            });
        }

        req.socket.to(game.getSocketRoomName()).emit("boardsChange", {
            type: op,
            boards: boardsTouched.map(b => b.toJSON()),
            gameId
        });

        // If we reach this point, all board operations were successful
        return {
            status: 200,
            response: this.buildSuccessResponse({
                game: game.toJSON()
            })
        };
    }
}

const boardOpSocketConsumer: SocketConsumer = (socket, io) => {
    const handler = new BingoBoardOpHandler();
    
    socket.on(SocketBoardOpEventName, async (args, callback) => {
        await handler.handle(socket, io, args, callback);
    });
};

export default boardOpSocketConsumer;