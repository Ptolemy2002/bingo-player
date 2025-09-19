import { z } from "zod";
import { ZodCleanSpaceSchema, ZodSpaceSchema } from "./Space";
import { swaggerRegistry } from "src/Swagger";
import { ZodSpaceIDSchema } from "./SpaceID";
import { ZodSpaceExampleSchema } from "./SpaceExample";
import { ZodSpaceNameSchema } from "./SpaceName";
import { ZodSpaceTagSchema } from "./SpaceTag";
import { refineNoAliasMatchingName, findAliasMatchingNameIndex } from "../Other";

function validateNotRepeat<T>(arr: T[]): boolean {
    if (arr.length === 0) return true;
    const set = new Set(arr);
    return set.size === arr.length;
}

const Zod_id = z.object({
    _id: ZodSpaceIDSchema,
    examples: z.array(ZodSpaceExampleSchema)
        .refine(validateNotRepeat, {
            error: "Examples must not repeat."
        }),
    aliases: z.array(ZodSpaceNameSchema)
        .refine(validateNotRepeat, {
            error: "Aliases must not repeat."
        })
        .openapi({
            description: "Aliases for the space.",
            example: ["Alias 1", "Alias 2"]
        }),
    tags: z.array(ZodSpaceTagSchema)
        .refine(validateNotRepeat, {
            error: "Tags must not repeat."
        })
});

const Zod_id_optional = Zod_id.extend(z.object({
    examples: Zod_id.shape.examples.default([]),
    aliases: Zod_id.shape.aliases.default([]),
    tags: Zod_id.shape.tags.default([])
}).shape);

export const ZodCleanMongoSpaceSchema = swaggerRegistry.register(
    "CleanMongoSpace",
    ZodCleanSpaceSchema.omit({ id: true })
    .extend(Zod_id.shape)
    .superRefine(({ name, aliases }, ctx) => {
        if (!refineNoAliasMatchingName(name, aliases)) {
            const index = findAliasMatchingNameIndex(name, aliases);
            ctx.addIssue({
                code: "custom",
                error: "No alias should match the name.",
                path: ["aliases", index ?? 0]
            });
        }
    })
    .openapi({
        description: "The MongoDB representation of a Space."
    })
);
export const ZodCleanMongoSpaceShape = ZodCleanMongoSpaceSchema.shape;

export const ZodMongoSpaceSchema = swaggerRegistry.register(
    "MongoSpace",
    ZodSpaceSchema.omit({ id: true })
    .extend(Zod_id_optional.shape)
    .superRefine(({ name, aliases }, ctx) => {
        if (!refineNoAliasMatchingName(name, aliases)) {
            const index = findAliasMatchingNameIndex(name, aliases);
            ctx.addIssue({
                code: "custom",
                error: "No alias should match the name.",
                path: ["aliases", index ?? 0]
            });
        }
    })
    .openapi({
        description: "CleanMongoSpace, but with some fields optional and provided sensible defaults."
    })
);
export const ZodMongoSpaceShape = ZodMongoSpaceSchema.shape;

export type CleanMongoSpace = z.infer<typeof ZodCleanMongoSpaceSchema>;
export type MongoSpace = z.input<typeof ZodMongoSpaceSchema>;