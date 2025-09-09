import SocketRouteHandler, { SocketRouteHandlerRequestData } from "lib/SocketRouteHandler";
import { SocketConsumer } from "services/socket";
import { SocketIDEventName, SocketIDSuccessResponse } from "shared";

export class SocketIDHandler extends SocketRouteHandler<SocketIDSuccessResponse> {
    constructor() {
        super(SocketIDEventName);
    }

    async generateResponse(req: SocketRouteHandlerRequestData) {
        return {
            status: 200,
            response: this.buildSuccessResponse({
                id: req.id
            })
        };
    }
}

const idSocketConsumer: SocketConsumer = (socket, io) => {
    socket.on(SocketIDEventName, async (callback) => {
        const handler = new SocketIDHandler();
        await handler.handle(socket, io, {}, callback);
    });
};

export default idSocketConsumer;