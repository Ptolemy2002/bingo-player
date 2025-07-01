import { SocketConsumer } from "services/socket"

const pingSocketConsumer: SocketConsumer = (socket) => {
    socket.on("ping", (callback) => {
        console.log("Ping received from client:", socket.id);
        callback("pong");
    });
};

export default pingSocketConsumer;