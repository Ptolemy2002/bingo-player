import SocketRouteHandler, { SocketRouteHandlerRequestData } from "lib/SocketRouteHandler";
import { SocketConsumer } from "services/socket";
import { SocketBoardTemplateOpSuccessResponse, SocketBoardTemplateOpEventName, ZodSocketBoardTemplateOpArgsSchema, BingoGameCollection } from "shared";

export class BingoBoardTemplateOpHandler extends SocketRouteHandler<SocketBoardTemplateOpSuccessResponse> {
    constructor() {
        super(SocketBoardTemplateOpEventName);
    }

    async generateResponse(req: SocketRouteHandlerRequestData) {
        const { success: argsSuccess, data: args, error: argsError} = ZodSocketBoardTemplateOpArgsSchema.safeParse(req.args);
        if (!argsSuccess) {
            return {
                status: 400,
                response: this.buildZodErrorResponse(argsError, "BAD_INPUT", {
                    prefix: "args"
                })
            };
        }

        const { gameId, op, templates, templateNames } = args;

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
                response: this.buildErrorResponse("FORBIDDEN", "Only players currently in the game can perform board template operations")
            };
        }

        const prevGameState = game.toJSON();

        // Necessary because if an error occurs midway through processing the board template operation, we should
        // act as if the entire operation never happened to avoid side effects
        function revertGameState() {
            return game.fromJSON(prevGameState);
        }

        try {
            if (op === "add") {
                if (!templates) {
                    // Should never be reached, as Zod should catch this
                    return {
                        status: 400,
                        response: this.buildErrorResponse("BAD_INPUT", "No templates provided for 'add' operation")
                    };
                }

                for (const template of templates) {
                    game.addBoardTemplate(template);
                }

                // Notify all players in the game about the board template changes
                req.socket.to(game.getSocketRoomName()).emit("boardTemplatesChange", { type: "add", boardTemplates: templates, gameId });
            } else if (op === "remove") {
                if (!templateNames) {
                    // Should never be reached, as Zod should catch this
                    return {
                        status: 400,
                        response: this.buildErrorResponse("BAD_INPUT", "No template names provided for 'remove' operation")
                    };
                }

                const templates = [];

                for (const templateName of templateNames) {
                    if (!game.hasBoardTemplate(templateName)) {
                        revertGameState();
                        return {
                            status: 404,
                            response: this.buildNotFoundResponse(`Board template with name "${templateName}" does not exist in game "${gameId}"`)
                        };
                    }
                    
                    templates.push(game.removeBoardTemplate(templateName));
                }

                // Notify all players in the game about the board template changes
                req.socket.to(game.getSocketRoomName()).emit(
                    "boardTemplatesChange", { type: "remove", boardTemplates: templates, gameId }
                );
            }
        } catch (e) {
            // This should be a RouteError, which can be rethrown and handled by the root level error handler
            // If it's not, the handler will find what it can from the error object and report it back to the client
            revertGameState();
            throw e;
        }

        // If we reach this point, all board template operations were successful
        return {
            status: 200,
            response: this.buildSuccessResponse({
                game: game.toJSON()
            })
        };
    }
}

const boardTemplateOpSocketConsumer: SocketConsumer = (socket, io) => {
    const handler = new BingoBoardTemplateOpHandler();
    
    socket.on(SocketBoardTemplateOpEventName, async (args, callback) => {
        await handler.handle(socket, io, args, callback);
    });
};

export default boardTemplateOpSocketConsumer;