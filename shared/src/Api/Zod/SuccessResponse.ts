import { z } from "zod";

export function zodSuccessResponseSchema<T>(dataSchema: z.ZodType<T>) {
    return z.intersection(
        dataSchema,
        z.object({
            ok: z.literal(true).openapi({
                description: "Whether the operation was successful.",
                example: true
            }),
            help: z.string().optional().openapi({
                description: "A URL to the docs page that may help the user understand the response.",
                example: "https://example.com/docs"
            })
        })
    );
}