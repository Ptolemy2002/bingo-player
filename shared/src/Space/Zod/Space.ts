import { swaggerRegistry } from "../../Swagger";
import { z } from "zod";

export const ZodSpaceSchema = swaggerRegistry.register(
    "CleanSpace",
    z.object({
        id: z.string()
            .openapi({
                description: "The ID of the space.",
                example: "abc123"
            }),
        name: z.string()
            .trim()
            .min(1, {message: "name must be at least 1 non-whitespace character long"})
            .openapi({
                description: "The name of the space.",
                example: "My Space"
            }),
        description: z.string()
            .nullable()
            .default(null)
            .openapi({
                description: "The description of the space.",
                example: "A space for my things."
            }),
        examples: z.array(
            z.string()
            .trim()
            .min(1, {message: "examples must be at least 1 non-whitespace character long"})
        ).default([])
        .openapi({
            description: "Examples of the space.",
            example: ["Example 1", "Example 2"]
        }),
        aliases: z.array(
            z.string()
            .trim()
            .min(1, {message: "aliases must be at least 1 non-whitespace character long"}))
            .default([])
            .openapi({
                description: "Aliases for the space.",
                example: ["Alias 1", "Alias 2"]
            }),
        tags: z.array(
            z.string().trim().regex(/^[a-zA-Z0-9_-]+$/, {
                message: "Invalid tag"
            })
            .toLowerCase()
        ).default([])
        .openapi({
            description: "Tags for the space.",
            example: ["tag1", "tag2"]
        }),
    }).openapi({
        description: "A space for a Bingo Board."
    })
);
export const ZodSpaceShape = ZodSpaceSchema.shape;

export type CleanSpace = z.infer<typeof ZodSpaceSchema>;
export type Space = z.input<typeof ZodSpaceSchema>;
