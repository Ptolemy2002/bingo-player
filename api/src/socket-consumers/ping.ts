import SocketRouteHandler, { SocketRouteHandlerRequestData } from "lib/SocketRouteHandler";
import { SocketConsumer } from "services/socket";
import { SocketPingEventName, SocketPingSuccessResponse } from "shared";

export class BingoPingHandler extends SocketRouteHandler<SocketPingSuccessResponse> {
    constructor() {
        super(SocketPingEventName);
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

const pingSocketConsumer: SocketConsumer = (socket, io) => {
    socket.on(SocketPingEventName, async (callback) => {
        const handler = new BingoPingHandler();
        await handler.handle(socket, io, {}, callback);
    });
};

export default pingSocketConsumer;