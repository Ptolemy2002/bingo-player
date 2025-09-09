import SocketRouteHandler, { SocketRouteHandlerRequestData } from "lib/SocketRouteHandler";
import { SocketConsumer } from "services/socket";
import { SocketGameListSuccessResponse, SocketGameListEventName, ZodSocketGameListArgsSchema, BingoGameCollection } from "shared";

export class BingoGameListHandler extends SocketRouteHandler<SocketGameListSuccessResponse> {
    constructor() {
        super(SocketGameListEventName);
    }

    async generateResponse(req: SocketRouteHandlerRequestData) {
        const { success: argsSuccess, data: args, error: argsError} = ZodSocketGameListArgsSchema.safeParse(req.args);

        if (!argsSuccess) {
            return {
                status: 400,
                response: this.buildZodErrorResponse(argsError, "BAD_INPUT", {
                    prefix: "args"
                })
            };
        }

        const { mine } = args;

        let games = BingoGameCollection.global.getAllGames();

        if (mine) {
            games = games.filter(game => game.hasPlayerBySocketId(req.id));
        }

        return {
            status: 200,
            response: this.buildSuccessResponse({
                games: games.map(game => game.toJSON())
            })
        };
    }
}

const gameListSocketConsumer: SocketConsumer = (socket, io) => {
    socket.on(SocketGameListEventName, async (args, callback) => {
        const handler = new BingoGameListHandler();
        await handler.handle(socket, io, args, callback);
    });
};

export default gameListSocketConsumer;