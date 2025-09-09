import SocketRouteHandler, { SocketRouteHandlerRequestData } from "lib/SocketRouteHandler";
import SpaceModel from "models/SpaceModel";
import { SocketConsumer } from "services/socket";
import { SocketSpaceOpSuccessResponse, SocketSpaceOpEventName, ZodSocketSpaceOpArgsSchema, BingoGameCollection } from "shared";

export class BingoSpaceOpHandler extends SocketRouteHandler<SocketSpaceOpSuccessResponse> {
    constructor() {
        super(SocketSpaceOpEventName);
    }

    async generateResponse(req: SocketRouteHandlerRequestData) {
        const { success: argsSuccess, data: args, error: argsError} = ZodSocketSpaceOpArgsSchema.safeParse(req.args);

        if (!argsSuccess) {
            return {
                status: 400,
                response: this.buildZodErrorResponse(argsError, "BAD_INPUT", {
                    prefix: "args"
                })
            };
        }

        const { gameId, op, spaces } = args;

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
                response: this.buildErrorResponse("FORBIDDEN", "Only players currently in the game can perform space operations")
            };
        }

        if (op !== "add") {
            for (const space in spaces) {
                if (!game.hasSpace(space)) {
                    return {
                        status: 404,
                        response: this.buildNotFoundResponse(`Space with ID/index "${space}" does not exist in game "${gameId}"`)
                    };
                }

                switch (op) {
                    case "mark": {
                        game.mark(space);
                        break;
                    }

                    case "unmark": {
                        game.unmark(space);
                        break;
                    }

                    case "toggleMark": {
                        game.toggleMark(space);
                        break;
                    }

                    case "remove": {
                        game.removeSpace(space);
                        break;
                    }
                }
            }
        } else {
            for (const space in spaces) {
                if (typeof space === "number") {
                    return {
                        status: 400,
                        response: this.buildErrorResponse("BAD_INPUT", `Space IDs cannot be numbers when adding new spaces. Offending value: ${space}`)
                    };
                }

                if (game.hasSpace(space)) {
                    return {
                        status: 409,
                        response: this.buildErrorResponse("CONFLICT", `Space with ID "${space}" already exists in game "${gameId}"`)
                    };
                }

                const spaceData = await SpaceModel.findOne({ _id: space });

                if (spaceData === null) {
                    return {
                        status: 404,
                        response: this.buildNotFoundResponse(`Space with ID "${space}" does not exist`)
                    };
                }

                game.addSpace(spaceData.toClientJSON());
            }
        }

        // If we reach this point, all space operations were successful
        return {
            status: 200,
            response: this.buildSuccessResponse({
                game: game.toJSON()
            })
        };
    }
}

const spaceOpSocketConsumer: SocketConsumer = (socket, io) => {
    socket.on(SocketSpaceOpEventName, async (args, callback) => {
        const handler = new BingoSpaceOpHandler();
        await handler.handle(socket, io, args, callback);
    });
};

export default spaceOpSocketConsumer;