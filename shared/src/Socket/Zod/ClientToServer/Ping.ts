import { ZodErrorResponseSchema, zodSuccessResponseSchema } from "src/Api";
import { registerSocketSchema } from "src/Socket/Registry";
import { z } from "zod";

export const SocketPingEventName = "bingoPing" as const;

export const ZodSocketPingArgsSchema = registerSocketSchema(z.undefined(), {
    id: "SocketPingArgs",
    type: "args",
    eventName: SocketPingEventName,
    description: `Arguments schema for the [${SocketPingEventName}] event`
});

export const ZodSocketPingSuccessResponseSchema = registerSocketSchema(
    zodSuccessResponseSchema(z.object({
        message: z.literal("pong")
    })),
    {
        id: "SocketPingSuccessResponse",
        type: "success-response",
        eventName: SocketPingEventName,
        description: `Response schema for a successful [${SocketPingEventName}] event`,
    }
);

export const ZodSocketPingResponseSchema = registerSocketSchema(
    z.union([
        ZodSocketPingSuccessResponseSchema,
        ZodErrorResponseSchema,
    ]),
    {
        id: "SocketPingResponse",
        eventName: SocketPingEventName,
        type: "response",
        description: `Response schema for the [${SocketPingEventName}] event`
    }
);

export type SocketPingArgs = z.infer<typeof ZodSocketPingArgsSchema>;
export type SocketPingSuccessResponse = z.infer<typeof ZodSocketPingSuccessResponseSchema>;
export type SocketPingResponse = z.infer<typeof ZodSocketPingResponseSchema>;