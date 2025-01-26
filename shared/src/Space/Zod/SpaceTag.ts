import { swaggerRegistry } from "src/Swagger";
import { z } from "zod";

export const ZodSpaceTagSchema = swaggerRegistry.register(
    "SpaceTag",
    z.string()
        .trim()
        // "in:" indicates this tag identifies a collection
        .regex(/^(in\:)?[a-zA-Z0-9-][a-zA-Z0-9_-]+$/, {
            message: "Invalid tag"
        })
        .toLowerCase()
        .openapi({
            description: "A tag for a space.",
            example: "tag-1 or in:collection-1"
        })
);

export type SpaceTag = z.infer<typeof ZodSpaceTagSchema>;