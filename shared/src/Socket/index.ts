import { SocketPingResponse } from ".";
import { SocketPingArgs } from ".";

export * from "./ClientToServer";

export type SocketEvent<A=undefined, R=undefined> = (...args: 
    A extends undefined ?
        R extends undefined ? [] : [(callback: R) => void]
    :
        R extends undefined ? [A] : [A, (callback: R) => void]
) => void;

export type SocketClientToServerEvents = {
    ping: SocketEvent<SocketPingArgs, SocketPingResponse>;
};

export type SocketServerToClientEvents = {};