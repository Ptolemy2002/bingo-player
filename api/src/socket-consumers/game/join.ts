import SocketRouteHandler, { SocketRouteHandlerRequestData } from "lib/SocketRouteHandler";
import { SocketConsumer } from "services/socket";
import { SocketGameJoinEventName, SocketGameJoinSuccessResponse, ZodSocketGameJoinArgsSchema, BingoGameCollection } from "shared";

export class BingoGameJoinHandler extends SocketRouteHandler<SocketGameJoinSuccessResponse> {
    constructor() {
        super(SocketGameJoinEventName);
    }

    async generateResponse(req: SocketRouteHandlerRequestData) {
        const { success: argsSuccess, data: args, error: argsError} = ZodSocketGameJoinArgsSchema.safeParse(req.args);

        if (!argsSuccess) {
            return {
                status: 400,
                response: this.buildZodErrorResponse(argsError, "BAD_INPUT", {
                    prefix: "args"
                })
            };
        }

        const { id: gameId, playerName, playerRole } = args;

        if (!BingoGameCollection.global.hasGame(gameId)) {
            return {
                status: 404,
                response: this.buildNotFoundResponse("Game with that ID does not exist")
            };
        }

        const game = BingoGameCollection.global.getGame(gameId)!;

        if (game.hasPlayerByName(playerName)) {
            return {
                status: 409,
                response: this.buildErrorResponse("CONFLICT", "Player with that name is already in the game")
            };
        }

        if (game.hasPlayerBySocketId(req.id)) {
            return {
                status: 409,
                response: this.buildErrorResponse("CONFLICT", "You cannot join the game twice")
            };
        }

        game.addPlayer({
            name: playerName,
            socketId: req.id,
            role: playerRole
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

const gameJoinSocketConsumer: SocketConsumer = (socket, io) => {
    socket.on(SocketGameJoinEventName, async (args, callback) => {
        const handler = new BingoGameJoinHandler();
        await handler.handle(socket, io, args, callback);
    });
};

export default gameJoinSocketConsumer;