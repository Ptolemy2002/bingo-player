import { io, ManagerOptions, SocketOptions as _SocketOptions, Socket as _Socket } from "socket.io-client";
import getEnv from "./Env";

export type Socket = _Socket & { offDebug: () => void, name: string };
export type SocketOptions = Partial<ManagerOptions & _SocketOptions>;

export const SocketInstances: Record<string, Socket> = {};

type GetSocketOptions = {
    key?: string;
    options?: SocketOptions;
    createNew?: boolean;
    debug?: boolean;
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

        const onError = (error: unknown) => {
            console.error(`${socketName} error:`, error);
        };

        const onAny = (event: string, ...args: unknown[]) => {
            console.debug(`${socketName} event: ${event}`, ...args);
        };

        result.on("connect", onConnect);
        result.on("disconnect", onDisconnect);
        result.on("error", onError);
        result.onAny(onAny);

        offDebug = () => {
            console.debug(`Turning off debug for ${socketName}...`);
            result.off("connect", onConnect);
            result.off("disconnect", onDisconnect);
            result.off("error", onError);
            result.offAny(onAny);
        };
    }

    result.offDebug = offDebug;
    SocketInstances[key] = result;
    return result;
}