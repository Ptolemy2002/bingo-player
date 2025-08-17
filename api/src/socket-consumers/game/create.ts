import { BingoGameCollection } from "lib/Bingo";
import SocketRouteHandler, { SocketRouteHandlerRequestData } from "lib/SocketRouteHandler";
import { SocketConsumer } from "services/socket";
import { SocketGameCreateEventName, SocketGameCreateSuccessResponse, ZodSocketGameCreateArgsSchema } from "shared";

export class BingoGameCreateHandler extends SocketRouteHandler<SocketGameCreateSuccessResponse> {
    constructor() {
        super(SocketGameCreateEventName);
    }

    async generateResponse(req: SocketRouteHandlerRequestData) {
        const { success: argsSuccess, data: args, error: argsError} = ZodSocketGameCreateArgsSchema.safeParse(req.args);

        if (!argsSuccess) {
            return {
                status: 400,
                response: this.buildZodErrorResponse(argsError, "BAD_INPUT", {
                    prefix: "args"
                })
            };
        }

        const { id: gameId, hostName } = args;

        if (BingoGameCollection.global.hasGame(gameId)) {
            return {
                status: 409,
                response: this.buildErrorResponse("CONFLICT", "Game with that ID already exists")
            };
        }

        const game = BingoGameCollection.global.addGame({ id: gameId });
        
        game.addPlayer({
            name: hostName,
            socketId: req.id,
            role: "host"
        });

        await req.socket.join(game.getSocketRoomName());

        return {
            status: 200,
            response: this.buildSuccessResponse({
                game: game.toJSON()
            })
        };
    }
}

const gameCreateSocketConsumer: SocketConsumer = (socket, io) => {
    socket.on(SocketGameCreateEventName, async (args, callback) => {
        const handler = new BingoGameCreateHandler();
        await handler.handle(socket, io, args, callback);
    });
};

export default gameCreateSocketConsumer;