import { response } from "express";
import { BingoGameCollection } from "lib/Bingo";
import SocketRouteHandler, { SocketRouteHandlerRequestData } from "lib/SocketRouteHandler";
import { getSocketClientById, SocketConsumer } from "services/socket";
import { SocketGameLeaveSuccessResponse, SocketGameLeaveEventName, ZodSocketGameLeaveArgsSchema } from "shared";

export class BingoGameLeaveHandler extends SocketRouteHandler<SocketGameLeaveSuccessResponse> {
    constructor() {
        super(SocketGameLeaveEventName);
    }

    async generateResponse(req: SocketRouteHandlerRequestData) {
        const { success: argsSuccess, data: args, error: argsError } = ZodSocketGameLeaveArgsSchema.safeParse(req.args);

        if (!argsSuccess) {
            return {
                status: 400,
                response: this.buildZodErrorResponse(argsError, "BAD_INPUT", {
                    prefix: "args"
                })
            };
        }

        const { id: gameId, playerName } = args;

        const game = BingoGameCollection.global.getGame(gameId);

        if (game === null) {
            return {
                status: 404,
                response: this.buildNotFoundResponse("Game with that ID does not exist")
            };
        }

        const player = game.getPlayerBySocketId(req.id);

        if (player === null) {
            return {
                status: 404,
                response: this.buildNotFoundResponse("Player not found in game")
            };
        }

        if (player.role !== "host" && player.name !== playerName) {
            return {
                status: 403,
                response: this.buildErrorResponse("FORBIDDEN", "Only hosts can kick other players off the game.")
            };
        }

        game.removePlayerByName(playerName);
        // Unsubscribe the client from the game room
        await getSocketClientById(req.io, player.socketId)?.leave(game.getSocketRoomName());

        return {
            status: 200,
            response: this.buildSuccessResponse({})
        };
    }
}

const gameLeaveSocketConsumer: SocketConsumer = (socket, io) => {
    socket.on(SocketGameLeaveEventName, async (args, callback) => {
        const handler = new BingoGameLeaveHandler();
        await handler.handle(socket, io, args, callback);
    });
};

export default gameLeaveSocketConsumer;