import { BingoGameCollection } from "lib/Bingo";
import SocketRouteHandler, { SocketRouteHandlerRequestData } from "lib/SocketRouteHandler";
import { SocketConsumer } from "services/socket";
import { SocketGameGetSuccessResponse, SocketGameGetEventName, ZodSocketGameGetArgsSchema } from "shared";

export class BingoGameGetHandler extends SocketRouteHandler<SocketGameGetSuccessResponse> {
    constructor() {
        super(SocketGameGetEventName);
    }

    async generateResponse(req: SocketRouteHandlerRequestData) {
        const { success: argsSuccess, data: args, error: argsError} = ZodSocketGameGetArgsSchema.safeParse(req.args);

        if (!argsSuccess) {
            return {
                status: 400,
                response: this.buildZodErrorResponse(argsError, "BAD_INPUT", {
                    prefix: "args"
                })
            };
        }

        const { id: gameId } = args;

        if (!BingoGameCollection.global.hasGame(gameId)) {
            return {
                status: 404,
                response: this.buildNotFoundResponse("Game with that ID does not exist")
            };
        }

        const game = BingoGameCollection.global.getGame(gameId)!;

        await req.socket.join(game.getSocketRoomName());

        return {
            status: 200,
            response: this.buildSuccessResponse({
                game: game.toJSON()
            })
        };
    }
}

const gameGetSocketConsumer: SocketConsumer = (socket, io) => {
    socket.on(SocketGameGetEventName, async (args, callback) => {
        const handler = new BingoGameGetHandler();
        await handler.handle(socket, io, args, callback);
    });
};

export default gameGetSocketConsumer;