import { io, ManagerOptions, SocketOptions as _SocketOptions, Socket as _Socket, EmitSafeReturn, EmitSafeParameters } from "socket.io-client";
import getEnv from "./Env";
import { ErrorCode, HelpLink, SocketClientToServerEvents, SocketServerToClientEvents } from "shared";

export type Socket = _Socket<SocketServerToClientEvents, SocketClientToServerEvents> & {
    name: string,
    offDebug: () => void
};
export type SocketOptions = Partial<ManagerOptions & _SocketOptions>;

export const SocketInstances: Record<string, Socket> = {};

type GetSocketOptions = {
    key?: string;
    options?: SocketOptions;
    createNew?: boolean;
    debug?: boolean;
};

export class SocketError extends Error {
    code: ErrorCode = "UNKNOWN";
    help: HelpLink = "https://example.com/docs";

    constructor(
        message: string, code: ErrorCode = "UNKNOWN", help: HelpLink = "https://example.com/docs"
    ) {
        super(message);
        this.code = code;
        this.help = help;
    }
}

export async function emitSafeWithAck<E extends keyof SocketClientToServerEvents>(
    socket: Socket | GetSocketOptions, event: E, ...args: EmitSafeParameters<E>
) {
    if (!(socket instanceof _Socket)) socket = getSocket(socket);

    const result = await socket.emitWithAck(event, ...args);

    if (!result.ok) {
        let message = result.message ?? "An unknown error occurred.";
        if (Array.isArray(message)) message = message.join("\n");
        throw new SocketError(message, result.code, result.help);
    }

    return result as EmitSafeReturn<E>;
}

_Socket.prototype.emitSafeWithAck = function<E extends keyof SocketClientToServerEvents>(
    this: Socket, event: E, ...args: EmitSafeParameters<E>
) {
    return emitSafeWithAck(this, event, ...args);
};

export default function getSocket(
    {
        key="default",
        options: {
            autoConnect = true,
            ...options
        }={},
        createNew = false,
        debug=false
    }: GetSocketOptions = {}
): Socket {
    const socketName = `Socket[${JSON.stringify(key)}]`;

    const Socket = SocketInstances[key];
    if (Socket && !createNew) {
        return Socket;
    }

    if (debug) console.debug(`Creating ${socketName}...`);
    const env = getEnv();

    const result = io(env.socketUrl, {
        autoConnect,
        ...options
    }) as Socket;
    
    result.name = socketName;

    let offDebug = () => {
        console.debug(`Attempted to turn off debug for ${socketName}, but it is not implemented.`);
    };

    if (debug) {
        const onConnect = () => {
            console.debug(`${socketName} connected:`, result.id);
        };

        const onDisconnect = () => {
            console.debug(`${socketName} disconnected:`, result.id);
        };

        const onAny = (event: string, ...args: unknown[]) => {
            console.debug(`${socketName} event: ${event}`, ...args);
        };

        result.on("connect", onConnect);
        result.on("disconnect", onDisconnect);
        result.onAny(onAny);

        offDebug = () => {
            console.debug(`Turning off debug for ${socketName}...`);
            result.off("connect", onConnect);
            result.off("disconnect", onDisconnect);
            result.offAny(onAny);
        };
    }

    result.offDebug = offDebug;
    SocketInstances[key] = result;

    if (debug) {
        console.debug(`${socketName} is ready. Emitting ping...`);
        result.emit("bingoPing", (res) => {
            if (res.ok && res.message === "pong") {
                console.debug(`${socketName} pong received with correct response.`);
            } else {
                console.error(`${socketName} pong received, but incorrect response:`, res);
            }
        });
    }

    return result;
}