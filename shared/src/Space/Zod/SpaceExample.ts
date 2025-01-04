import { swaggerRegistry } from "src/Swagger";
import { z } from "zod";

export const ZodSpaceExampleSchema = swaggerRegistry.register(
    "SpaceExample",
    z.string()
        .trim()
        .min(1, {message: "examples must be at least 1 non-whitespace character long"})
        .openapi({
            description: "An example of what could be considered applicable to a space.",
            example: "Example 1"
        })
);

export type SpaceExample = z.infer<typeof ZodSpaceExampleSchema>;