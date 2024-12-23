import { z } from "zod";
import { Types } from "mongoose";

export const ZodSpaceSchema = z.object({
    id: z.string(),
    name: z.string().trim().min(1, {message: "name must be at least 1 non-whitespace character long"}),
    description: z.string().nullable().default(null),
    examples: z.array(z.string().trim().min(1, {message: "examples must be at least 1 non-whitespace character long"})).default([]),
    aliases: z.array(z.string().trim().min(1, {message: "aliases must be at least 1 non-whitespace character long"})).default([]),
    tags: z.array(
        z.string().trim().regex(/^[a-zA-Z0-9_-]+$/, {
            message: "Invalid tag"
        })
        .toLowerCase()
    ).default([])
});
export type CleanSpace = z.infer<typeof ZodSpaceSchema>;
export type Space = z.input<typeof ZodSpaceSchema>;
export const ZodSpaceShape = ZodSpaceSchema.shape;

export const ZodMongoSpaceSchema =
    ZodSpaceSchema.omit({ id: true })
    .merge(z.object({ _id: z.string() }))
    .refine(data => Types.ObjectId.isValid(data._id), {
        message: "Invalid _id"
    })
;
export type CleanMongoSpace = z.infer<typeof ZodMongoSpaceSchema>;
export type MongoSpace = z.input<typeof ZodMongoSpaceSchema>;
export const ZodMongoSpaceShape = ZodMongoSpaceSchema._def.schema.shape;

export const ZodSpaceQueryPropSchema = z.enum([
    "id",
    "name",
    "description",
    "examples",
    "aliases",
    "tags",

    "_id",
    "known-as",
    "alias",
    "tag",
    "example"
], {
    message: "Invalid space query prop"
});
export type SpaceQueryProp = z.input<typeof ZodSpaceQueryPropSchema>;

// The clean functions will populate values for all optional
// fields and perform transformations such as trimming strings
// and converting tags to lowercase.
export function cleanSpace(space: Space): CleanSpace {
    return ZodSpaceSchema.parse(space);
}

export function cleanMongoSpace(mongoSpace: MongoSpace): CleanMongoSpace {
    return ZodMongoSpaceSchema.parse(mongoSpace);
}

// Simple type guards
export function isSpace(v: unknown): v is Space {
    return ZodSpaceSchema.safeParse(v).success;
}

export function isMongoSpace(v: unknown): v is MongoSpace {
    return ZodMongoSpaceSchema.safeParse(v).success;
}

// These conversion functions will also do cleaning for us
export function toSpace(space: MongoSpace | Space): CleanSpace {
    const {success, data} = ZodSpaceSchema.safeParse(space);
    if (success) {
        return data;
    }

    // Zod doesn't do type guards, so we need to tell
    // TypeScript that the space is a MongoSpace.
    const {_id, ...rest} = space as MongoSpace;
    return cleanSpace({
        id: _id,
        ...rest
    });
}

export function toMongoSpace(space: MongoSpace | Space): CleanMongoSpace {
    const {success, data} = ZodMongoSpaceSchema.safeParse(space);
    if (success) {
        return data;
    }

    // Zod doesn't do type guards, so we need to tell
    // TypeScript that the space is a Space.
    const {id, ...rest} = space as Space;
    return cleanMongoSpace({
        _id: id,
        ...rest
    });
}