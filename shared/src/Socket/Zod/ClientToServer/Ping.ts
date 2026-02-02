import { ZodErrorResponseSchema, zodSuccessResponseSchema } from "src/Api";
import { registerSocketSchema } from "src/Socket/Registry";
import { z } from "zod";

export const SocketPingEventName = "bingoPing" as const;

export const ZodSocketPingArgsSchema = registerSocketSchema(z.undefined(), {
    id: "SocketPingArgs",
    type: "args",
    eventName: SocketPingEventName,
    description: `Send this message to ensure the server is up.`
});

export const ZodSocketPingSuccessResponseSchema = registerSocketSchema(
    zodSuccessResponseSchema(z.object({
        message: z.literal("pong")
    })),
    {
        id: "SocketPingSuccessResponse",
        type: "success-response",
        eventName: SocketPingEventName,
        description: `Acknowledgement of your ping`,
        example: {
            ok: true,
            message: "pong"
        } as any // To avoid TS error about excess properties in the example
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
        description: `Response schema for the [${SocketPingEventName}] event`,
        example: {
            ok: false,
            code: "UNKNOWN",
            message: "An unknown error occurred.",
            help: "http://bingo.api/docs#event-bingoPing",
        }
    }
);

export type SocketPingArgs = z.infer<typeof ZodSocketPingArgsSchema>;
export type SocketPingSuccessResponse = z.infer<typeof ZodSocketPingSuccessResponseSchema>;
export type SocketPingResponse = z.infer<typeof ZodSocketPingResponseSchema>;