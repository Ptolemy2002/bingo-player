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
            message: "Examples must not repeat."
        }),
    aliases: z.array(ZodSpaceNameSchema)
        .refine(validateNotRepeat, {
            message: "Aliases must not repeat."
        })
        .openapi({
            description: "Aliases for the space.",
            example: ["Alias 1", "Alias 2"]
        }),
    tags: z.array(ZodSpaceTagSchema)
        .refine(validateNotRepeat, {
            message: "Tags must not repeat."
        })
});

const Zod_id_optional = Zod_id.merge(z.object({
    examples: Zod_id.shape.examples.default([]),
    aliases: Zod_id.shape.aliases.default([]),
    tags: Zod_id.shape.tags.default([])
}));

export const ZodCleanMongoSpaceSchema = swaggerRegistry.register(
    "CleanMongoSpace",
    ZodCleanSpaceSchema._def.schema.omit({ id: true })
    .merge(Zod_id)
    .superRefine(({ name, aliases }, ctx) => {
        if (!refineNoAliasMatchingName(name, aliases)) {
            const index = findAliasMatchingNameIndex(name, aliases);
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "No alias should match the name.",
                path: ["aliases", index ?? 0]
            });
        }
    })
    .openapi({
        description: "The MongoDB representation of a Space."
    })
);
export const ZodCleanMongoSpaceShape = ZodCleanMongoSpaceSchema._def.schema.shape;

export const ZodMongoSpaceSchema = swaggerRegistry.register(
    "MongoSpace",
    ZodSpaceSchema._def.schema.omit({ id: true })
    .merge(Zod_id_optional)
    .superRefine(({ name, aliases }, ctx) => {
        if (!refineNoAliasMatchingName(name, aliases)) {
            const index = findAliasMatchingNameIndex(name, aliases);
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "No alias should match the name.",
                path: ["aliases", index ?? 0]
            });
        }
    })
    .openapi({
        description: "CleanMongoSpace, but with some fields optional and provided sensible defaults."
    })
);
export const ZodMongoSpaceShape = ZodMongoSpaceSchema._def.schema.shape;

export type CleanMongoSpace = z.infer<typeof ZodCleanMongoSpaceSchema>;
export type MongoSpace = z.input<typeof ZodMongoSpaceSchema>;