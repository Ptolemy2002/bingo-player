import SocketRouteHandler, { SocketRouteHandlerRequestData } from "lib/SocketRouteHandler";
import { SocketConsumer } from "services/socket";
import { SocketPingSuccessResponse } from "shared";

class BingoPingHandler extends SocketRouteHandler<SocketPingSuccessResponse> {
    constructor() {
        super("bingoPing");
    }

    async generateResponse(req: SocketRouteHandlerRequestData) {
        console.log("Ping received from client:", req.id);

        return {
            status: 200,
            response: this.buildSuccessResponse({
                message: "pong"
            })
        };
    }
}

const pingSocketConsumer: SocketConsumer = (socket) => {
    socket.on("bingoPing", async (callback) => {
        const handler = new BingoPingHandler();

        await handler.handle(socket, {}, callback);
    });
};

export default pingSocketConsumer;