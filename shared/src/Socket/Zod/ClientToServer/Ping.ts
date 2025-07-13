import { z } from "zod";

export const ZodSocketPingArgsSchema = z.undefined();
export const ZodSocketPingResponseSchema = z.literal("pong");

export type SocketPingArgs = z.infer<typeof ZodSocketPingArgsSchema>;
export type SocketPingResponse = z.infer<typeof ZodSocketPingResponseSchema>;