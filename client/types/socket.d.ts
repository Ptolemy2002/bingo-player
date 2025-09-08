import { SocketClientToServerEvents } from "shared";
import "socket.io-client";

declare module "socket.io-client" {
    // Copied from socket.io-client 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    type AllButLast<T extends any[]> = T extends [...infer H, infer _L] ? H : any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    type Last<T extends any[]> = T extends [...infer _H, infer L] ? L : never;

    export type EmitSafeReturn<E extends keyof SocketClientToServerEvents> =
        Extract<
            Parameters<Last<Parameters<SocketClientToServerEvents[E]>>>[0],
            {ok: true}
        >
    ;

    export type EmitSafeParameters<E extends keyof SocketClientToServerEvents> =
        AllButLast<Parameters<SocketClientToServerEvents[E]>>
    ;

    // Extend the Socket interface to include our custom events
    export interface Socket {
        emitSafeWithAck<E extends keyof SocketClientToServerEvents>(
            event: E, ...args: EmitSafeParameters<E>
        ): Promise<EmitSafeReturn<E>>
    };
}