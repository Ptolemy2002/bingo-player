import { SocketPingResponse } from ".";
import { SocketPingArgs } from ".";
import {
    SocketGameCreateArgs, SocketGameCreateResponse, SocketGameListArgs, SocketGameListResponse,
    SocketGameStateArgs, SocketGameStateResponse, SocketGameJoinArgs, SocketGameJoinResponse,
    SocketGameLeaveArgs, SocketGameLeaveResponse, SocketSpaceOpArgs,
    SocketSpaceOpResponse, SocketGameCreateEventName, SocketGameJoinEventName,
    SocketGameLeaveEventName,
    SocketGameListEventName,
    SocketGameStateEventName,
    SocketSpaceOpEventName,
    SocketPingEventName
} from "./Zod";

export * from "./Zod";
export * from "./Registry";
export * from "./Other";

export type SocketEvent<A=undefined, R=undefined> = (...args: 
    [A] extends [undefined] ?
        [R] extends [undefined] ? [] : [(value: R) => void]
    :
        [R] extends [undefined] ? [A] : [A, (value: R) => void]
) => void;

export type SocketClientToServerEvents = {
    [SocketPingEventName]: SocketEvent<SocketPingArgs, SocketPingResponse>;

    [SocketGameStateEventName]: SocketEvent<SocketGameStateArgs, SocketGameStateResponse>;
    [SocketGameListEventName]: SocketEvent<SocketGameListArgs, SocketGameListResponse>;
    [SocketGameCreateEventName]: SocketEvent<SocketGameCreateArgs, SocketGameCreateResponse>;
    [SocketGameJoinEventName]: SocketEvent<SocketGameJoinArgs, SocketGameJoinResponse>;
    [SocketGameLeaveEventName]: SocketEvent<SocketGameLeaveArgs, SocketGameLeaveResponse>;

    [SocketSpaceOpEventName]: SocketEvent<SocketSpaceOpArgs, SocketSpaceOpResponse>;
};

export type SocketServerToClientEvents = {};