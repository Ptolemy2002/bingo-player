import { z } from "zod";
import { registerSocketSchema } from "../Registry";

export const SocketIDExample = "12345678901234567890" as const;

export const ZodSocketIDSchema = registerSocketSchema(
    z.string().length(20, "Socket ID must be exactly 20 characters"),
    {
        id: "SocketID",
        type: "other",
        description: "A unique identifier for a socket connection, exactly 20 characters long.",
        example: SocketIDExample
    }
);

export type SocketID = z.infer<typeof ZodSocketIDSchema>;