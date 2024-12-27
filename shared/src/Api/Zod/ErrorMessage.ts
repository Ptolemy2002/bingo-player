import { swaggerRegistry } from "src/Swagger";
import { z } from "zod";

export const ZodErrorMessageSchema = swaggerRegistry.register(
    "ErrorMessage",
    z.union([z.string(), z.array(z.string())]).nullable().openapi({
        description: "A message describing an error.",
        example: "Internal server error."
    })
);

export type ErrorMessage = z.infer<typeof ZodErrorMessageSchema>;