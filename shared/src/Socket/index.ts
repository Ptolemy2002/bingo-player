import { SocketPingResponse } from ".";
import { SocketPingArgs } from ".";

export * from "./Zod";

export type SocketEvent<A=undefined, R=undefined> = (...args: 
    [A] extends [undefined] ?
        [R] extends [undefined] ? [] : [(value: R) => void]
    :
        [R] extends [undefined] ? [A] : [A, (value: R) => void]
) => void;

export type SocketClientToServerEvents = {
    bingoPing: SocketEvent<SocketPingArgs, SocketPingResponse>;
};

export type SocketServerToClientEvents = {};