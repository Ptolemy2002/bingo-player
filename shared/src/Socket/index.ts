import { SocketPingResponse } from ".";
import { SocketPingArgs } from ".";
import {
    SocketGameCreateArgs, SocketGameCreateResponse, SocketGameListArgs, SocketGameListResponse,
    SocketGameGetArgs, SocketGameGetResponse, SocketGameJoinArgs, SocketGameJoinResponse,
    SocketGameLeaveArgs, SocketGameLeaveResponse, SocketSpaceOpArgs,
    SocketSpaceOpResponse, SocketGameCreateEventName, SocketGameJoinEventName,
    SocketGameLeaveEventName,
    SocketGameListEventName,
    SocketGameGetEventName,
    SocketSpaceOpEventName,
    SocketPingEventName,
    SocketIDEventName,
    SocketIDArgs,
    SocketIDResponse,
    SocketPlayersChangeEventName,
    SocketPlayersChangeData,
    SocketSpacesChangeEventName,
    SocketSpacesChangeData
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
    [SocketIDEventName]: SocketEvent<SocketIDArgs, SocketIDResponse>;

    [SocketGameGetEventName]: SocketEvent<SocketGameGetArgs, SocketGameGetResponse>;
    [SocketGameListEventName]: SocketEvent<SocketGameListArgs, SocketGameListResponse>;
    [SocketGameCreateEventName]: SocketEvent<SocketGameCreateArgs, SocketGameCreateResponse>;
    [SocketGameJoinEventName]: SocketEvent<SocketGameJoinArgs, SocketGameJoinResponse>;
    [SocketGameLeaveEventName]: SocketEvent<SocketGameLeaveArgs, SocketGameLeaveResponse>;

    [SocketSpaceOpEventName]: SocketEvent<SocketSpaceOpArgs, SocketSpaceOpResponse>;
};

export type SocketServerToClientEvents = {
    [SocketPlayersChangeEventName]: SocketEvent<SocketPlayersChangeData>;
    [SocketSpacesChangeEventName]: SocketEvent<SocketSpacesChangeData>;
};