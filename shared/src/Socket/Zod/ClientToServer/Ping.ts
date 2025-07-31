import { ZodErrorResponseSchema, zodSuccessResponseSchema } from "src/Api";
import { registerSocketSchema } from "src/Socket/Registry";
import { z } from "zod";

export const ZodSocketPingArgsSchema = z.undefined();
export const ZodSocketPingSuccessResponseSchema = registerSocketSchema(
    zodSuccessResponseSchema(z.object({
        message: z.literal("pong")
    })),
    {
        id: "SocketPingSuccessResponse",
        description: "Response schema for a successful Socket Ping request"
    }
);

export const ZodSocketPingResponseSchema = registerSocketSchema(
    z.union([
        ZodSocketPingSuccessResponseSchema,
        ZodErrorResponseSchema,
    ]),
    {
        id: "SocketPingResponse",
        description: "Response schema for the Socket Ping request"
    }
);

export type SocketPingArgs = z.infer<typeof ZodSocketPingArgsSchema>;
export type SocketPingSuccessResponse = z.infer<typeof ZodSocketPingSuccessResponseSchema>;
export type SocketPingResponse = z.infer<typeof ZodSocketPingResponseSchema>;