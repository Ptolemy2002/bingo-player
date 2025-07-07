import { SocketConsumer } from "services/socket"

const pingSocketConsumer: SocketConsumer = (socket) => {
    socket.on("bingoPing", (callback) => {
        console.log("Ping received from client:", socket.id);
        callback("pong");
    });
};

export default pingSocketConsumer;