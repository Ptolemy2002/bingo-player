import { swaggerRegistry } from "src/Swagger";
import { z } from "zod";
import { ZodSpaceIDSchema } from "./SpaceID";
import { ZodSpaceNameSchema } from "./SpaceName";
import { ZodSpaceDescriptionSchema } from "./SpaceDescription";
import { ZodSpaceExampleSchema } from "./SpaceExample";
import { ZodSpaceTagSchema } from "./SpaceTag";

export const ZodCleanSpaceSchema = swaggerRegistry.register(
    "CleanSpace",
    z.object({
        id: ZodSpaceIDSchema,
        name: ZodSpaceNameSchema,
        description: ZodSpaceDescriptionSchema,
        examples: z.array(ZodSpaceExampleSchema),
        aliases: z.array(ZodSpaceNameSchema)
            .openapi({
                description: "Aliases for the space.",
                example: ["Alias 1", "Alias 2"]
            }),
        tags: z.array(ZodSpaceTagSchema)
    }).openapi({
        description: "A space for a Bingo Board."
    })
);
export const ZodCleanSpaceShape = ZodCleanSpaceSchema.shape;

export const ZodSpaceSchema = swaggerRegistry.register(
    "Space",
    ZodCleanSpaceSchema.merge(z.object({
        description: ZodCleanSpaceShape.description.default(null),
        examples: ZodCleanSpaceShape.examples.default([]),
        aliases: ZodCleanSpaceShape.aliases.default([]),
        tags: ZodCleanSpaceShape.tags.default([])
    })).openapi({
        description: "CleanSpace, but with some fields optional and provided sensible defaults."
    })
);
export const ZodSpaceShape = ZodSpaceSchema.shape;


export type CleanSpace = z.infer<typeof ZodCleanSpaceSchema>;
export type Space = z.input<typeof ZodSpaceSchema>;
