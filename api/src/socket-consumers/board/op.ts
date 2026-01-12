import SocketRouteHandler, { SocketRouteHandlerRequestData } from "lib/SocketRouteHandler";
import { SocketConsumer } from "services/socket";
import { SocketBoardOpSuccessResponse, SocketBoardOpEventName, ZodSocketBoardOpArgsSchema, BingoGameCollection } from "shared";

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
                response: this.buildNotFoundResponse("Game with that ID does not exist")
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

        const prevGameState = game.toJSON();

        // Necessary because if an error occurs midway through processing the board operation, we should
        // act as if the entire operation never happened to avoid side effects
        function revertGameState() {
            return game.fromJSON(prevGameState);
        }

        for (const board of boards) {
            if (op !== "add" && !game.hasBoard(board)) {
                revertGameState();
                return {
                    status: 404,
                    response: this.buildNotFoundResponse(`Board with ID "${board}" does not exist in game "${gameId}"`)
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

                        const template = game.getBoardTemplate(templateName);

                        if (!template) {
                            revertGameState();
                            return {
                                status: 404,
                                response: this.buildNotFoundResponse(`Board template with name "${templateName}" does not exist in game "${gameId}"`)
                            };
                        }

                        return {
                            status: 501,
                            response: this.buildNotImplementedResponse("Adding boards is not yet implemented")
                        };
                    }

                    case "remove": {
                        game.removeBoard(board);
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