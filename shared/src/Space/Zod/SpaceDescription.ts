import { swaggerRegistry } from "src/Swagger";
import { z } from "zod";

export const ZodSpaceDescriptionSchema = swaggerRegistry.register(
    "SpaceDescription",
    z.string()
        .nullable()
        .openapi({
            description: "A description of a space.",
            example: "This is a space for a Bingo Board."
        })
);

export type SpaceDescription = z.infer<typeof ZodSpaceDescriptionSchema>;