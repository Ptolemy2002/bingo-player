import { ZodErrorResponseSchema, zodSuccessResponseSchema } from "src/Api";
import { registerSocketSchema } from "src/Socket/Registry";
import { z } from "zod";
import { SocketIDExample, ZodSocketIDSchema } from "../ID";

export const SocketIDEventName= "socketId" as const;

export const ZodSocketIDArgsSchema = registerSocketSchema(z.undefined(), {
    id: "SocketIDArgs",
    type: "args",
    eventName: SocketIDEventName,
    description: `Send this message to retrieve your unique socket ID assigned by the server.`
});

export const ZodSocketIDSuccessResponseSchema = registerSocketSchema(
    zodSuccessResponseSchema(z.object({
        id: registerSocketSchema(
            // This `refine` pattern allows us to copy the schema so that the original metadata
            // is not overwritten on `ZodSocketIDSchema`.
            ZodSocketIDSchema.refine(() => true),
            {
                id: "SocketIDSuccessResponse.id",
                type: "prop",
                description: "Your unique socket ID assigned by the server",
                example: SocketIDExample
            }
        )
    })),
    {
        id: "SocketIDSuccessResponse",
        type: "success-response",
        eventName: SocketIDEventName,
        description: `Your unique socket ID assigned by the server`,
        example: {
            ok: true,
            help: "http://bingo.api/docs#event-socketId",
            id: SocketIDExample
        } as any // To avoid TS error about excess properties in the example
    }
);

export const ZodSocketIDResponseSchema = registerSocketSchema(
    z.union([
        ZodSocketIDSuccessResponseSchema,
        ZodErrorResponseSchema,
    ]),
    {
        id: "SocketIDResponse",
        eventName: SocketIDEventName,
        type: "response",
        description: `Response schema for the [${SocketIDEventName}] event`,
        example: {
            ok: false,
            code: "UNKNOWN",
            message: "An unknown error occurred.",
            help: "http://bingo.api/docs#event-socketId",
        }
    }
);

export type SocketIDArgs = z.infer<typeof ZodSocketIDArgsSchema>;
export type SocketIDSuccessResponse = z.infer<typeof ZodSocketIDSuccessResponseSchema>;
export type SocketIDResponse = z.infer<typeof ZodSocketIDResponseSchema>;
