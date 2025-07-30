import { swaggerRegistry } from "src/Swagger";
import { z } from "zod";

export const ZodSpaceNameSchema = swaggerRegistry.register(
    "SpaceName",
    z.string()
        .trim()
        .min(1, {error: "A space's name must be at least 1 non-whitespace character long"})
        .openapi({
            description: "The name of a space.",
            example: "My Space"
        })
);

export type SpaceName = z.infer<typeof ZodSpaceNameSchema>;