import { z } from "zod";

export const ZodSocketIDSchema = z.string().length(20, "Socket ID must be exactly 20 characters");

export type SocketID = z.infer<typeof ZodSocketIDSchema>;