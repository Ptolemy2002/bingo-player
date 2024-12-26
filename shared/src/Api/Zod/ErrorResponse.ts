import { swaggerRegistry } from "../../Swagger";
import { z } from "zod";
import { ZodErrorCodeSchema } from "./ErrorCode";

export const ZodErrorResponseSchema = swaggerRegistry.register(
    "ErrorResponse",
    z.object({
        ok: z.literal(false).openapi({
            description: "Whether the operation was successful.",
            example: false
        }),
        code: ZodErrorCodeSchema.openapi({
            description: "The error code."
        }),
        message: z.union([z.string(), z.array(z.string())]).nullable().openapi({
            description: "A message describing the error.",
            example: "The parameters provided were invalid."
        }),
        help: z.string().optional().openapi({
            description: "A URL to the docs page that may help the user resolve the error.",
            example: "https://example.com/docs"
        })
    }).openapi({
        description: "An error response from the server."
    })
);

export type ErrorResponse = z.infer<typeof ZodErrorResponseSchema>;
