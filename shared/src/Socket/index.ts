import { SocketPingResponse } from ".";
import { SocketPingArgs } from ".";
import { GameStateArgs, GameStateResponse } from "./Zod";

export * from "./Zod";
export * from "./Registry";

export type SocketEvent<A=undefined, R=undefined> = (...args: 
    [A] extends [undefined] ?
        [R] extends [undefined] ? [] : [(value: R) => void]
    :
        [R] extends [undefined] ? [A] : [A, (value: R) => void]
) => void;

export type SocketClientToServerEvents = {
    bingoPing: SocketEvent<SocketPingArgs, SocketPingResponse>;
    gameState: SocketEvent<GameStateArgs, GameStateResponse>;
};

export type SocketServerToClientEvents = {};