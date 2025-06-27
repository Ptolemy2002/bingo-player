import { Socket, Server as SocketServer } from 'socket.io';
import { createServer, Server as HttpServer } from 'http';
import { Express } from 'express';
import getEnv from 'env';

export type SocketConsumer = (socket: Socket, io: SocketServer) => void;

let server: HttpServer | null = null;
let io: SocketServer | null = null;
let socketConsumers: Record<string, SocketConsumer> = {};

export function initServer(app: Express) {
    server = createServer(app);
    return server;
}

export function initIO(app: Express) {
    if (!server) server = initServer(app);

    io = new SocketServer(server, {
        cors: {
            origin: getEnv().clientURL,
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });

        // Call all registered consumers
        for (const consumer of Object.values(socketConsumers)) {
            consumer(socket, io!);
        }
    });

    return io;
}

export function initSocket(app: Express) {
    server = initServer(app);
    io = initIO(app);

    return { server, io };
}

export function getServer(app?: Express, createNew=false) {
    if (createNew || !server) {
        if (!app) throw new Error("Server is not initialized and no Express app provided for initialization");
        initServer(app);
    }

    return server!;
}

export function getIO(app?: Express, createNew=false) {
    if (createNew || !io) {
        if (!app) throw new Error("Socket.IO is not initialized and no Express app provided for initialization");
        initIO(app);
    }
    return io!;
}

export function getSocket(app?: Express, createNew=false) {
    if (createNew || !io || !server) {
        if (!app) throw new Error("Socket server is not initialized and no Express app provided for initialization");
        initSocket(app);
    }

    return { server: server!, io: io! };
}

export function startSocket(port: number, app?: Express, createNew=false) {
    const { server, io } = getSocket(app, createNew);

    server.listen(port, () => {
        console.log("Socket server listening on port", port);
    });

    return { server, io };
}

export function registerSocketConsumer(name: string, consumer: SocketConsumer) {
    if (socketConsumers[name]) {
        console.warn(`Socket consumer with name "${name}" already exists. Overwriting.`);
    }

    socketConsumers[name] = consumer;
}

export function clearSocketConsumers(...consumers: string[]) {
    if (consumers.length === 0) {
        socketConsumers = {};
        return;
    }

    for (const consumer of consumers) {
        if (socketConsumers[consumer]) {
            delete socketConsumers[consumer];
        } else {
            console.warn(`Socket consumer with name "${consumer}" does not exist. Skipping its deletion.`);
        }
    }
}

export function getSocketConsumers() {
    return socketConsumers;
}
