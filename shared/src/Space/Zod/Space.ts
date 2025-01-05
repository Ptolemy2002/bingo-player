import { swaggerRegistry } from "src/Swagger";
import { z } from "zod";
import { ZodSpaceIDSchema } from "./SpaceID";
import { ZodSpaceNameSchema } from "./SpaceName";
import { ZodSpaceDescriptionSchema } from "./SpaceDescription";
import { ZodSpaceExampleSchema } from "./SpaceExample";
import { ZodSpaceTagSchema } from "./SpaceTag";
import { refineNoAliasMatchingName } from "../Other";

export const ZodCleanSpaceSchema = swaggerRegistry.register(
    "CleanSpace",
    z.object({
        id: ZodSpaceIDSchema,
        name: ZodSpaceNameSchema,
        description: ZodSpaceDescriptionSchema,
        examples: z.set(ZodSpaceExampleSchema),
        aliases: z.set(ZodSpaceNameSchema)
            .openapi({
                description: "Aliases for the space.",
                example: new Set(["Alias 1", "Alias 2"])
            }),
        tags: z.set(ZodSpaceTagSchema)
    })
    .refine(({ name, aliases }) => refineNoAliasMatchingName(name, aliases), {
        message: "No alias should match the name.",
        path: ["aliases"]
    })
    .openapi({
        description: "A space for a Bingo Board."
    })
);
export const ZodCleanSpaceShape = ZodCleanSpaceSchema._def.schema.shape;

export const ZodSpaceSchema = swaggerRegistry.register(
    "Space",
    ZodCleanSpaceSchema._def.schema.merge(z.object({
        description: ZodCleanSpaceShape.description.default(null),
        examples: ZodCleanSpaceShape.examples.default(new Set()),
        aliases: ZodCleanSpaceShape.aliases.default(new Set()),
        tags: ZodCleanSpaceShape.tags.default(new Set())
    }))
    .refine(({ name, aliases }) => refineNoAliasMatchingName(name, aliases), {
        message: "No alias should match the name.",
        path: ["aliases"]
    })
    .openapi({
        description: "CleanSpace, but with some fields optional and provided sensible defaults."
    })
);
export const ZodSpaceShape = ZodSpaceSchema._def.schema.shape;


export type CleanSpace = z.infer<typeof ZodCleanSpaceSchema>;
export type Space = z.input<typeof ZodSpaceSchema>;
