import { ZodErrorResponseSchema, zodSuccessResponseSchema } from "src/Api";
import { z } from "zod";

export const ZodSocketPingArgsSchema = z.undefined();
export const ZodSocketPingSuccessResponseSchema = zodSuccessResponseSchema(z.object({
    message: z.literal("pong")
}));

export const ZodSocketPingResponseSchema = z.union([
    ZodSocketPingSuccessResponseSchema,
    ZodErrorResponseSchema,
]);

export type SocketPingArgs = z.infer<typeof ZodSocketPingArgsSchema>;
export type SocketPingSuccessResponse = z.infer<typeof ZodSocketPingSuccessResponseSchema>;
export type SocketPingResponse = z.infer<typeof ZodSocketPingResponseSchema>;