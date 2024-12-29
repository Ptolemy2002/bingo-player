import { swaggerRegistry } from "src/Swagger";
import { z } from "zod";

export const ZodSuccessResponseBaseSchema = swaggerRegistry.register(
    "SuccessResponseBase",
    z.object({
        ok: z.literal(true).openapi({
            description: "Whether the operation was successful.",
            example: true
        }),
        help: z.string().optional().openapi({
            description: "A URL to the docs page that may help the user understand the response.",
            example: "https://example.com/docs"
        })
    }).openapi({
        description: "A successful response from the server."
    })
);

export function zodSuccessResponseSchema<T>(dataSchema: z.ZodType<T>) {
    return z.intersection(
        dataSchema,
        ZodSuccessResponseBaseSchema
    );
}

export type SuccessResponseBase = z.infer<typeof ZodSuccessResponseBaseSchema>;