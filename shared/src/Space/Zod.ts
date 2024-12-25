import { Types } from "mongoose";
import { z } from "zod";
import { SpaceQueryPropEnum } from "./Other";

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
export const ZodSpaceShape = ZodSpaceSchema.shape;

export const ZodMongoSpaceSchema =
    ZodSpaceSchema.omit({ id: true })
    .merge(z.object({ _id: z.string() }))
    .refine(data => Types.ObjectId.isValid(data._id), {
        message: "Invalid _id"
    })
;
export const ZodMongoSpaceShape = ZodMongoSpaceSchema._def.schema.shape;

export const ZodSpaceQueryPropSchema = z.enum(SpaceQueryPropEnum, {
    message: "Invalid space query prop"
});

export const ZodSpaceQueryPropNonIdSchema = ZodSpaceQueryPropSchema.exclude(["id", "_id"]);

export type CleanSpace = z.infer<typeof ZodSpaceSchema>;
export type Space = z.input<typeof ZodSpaceSchema>;

export type CleanMongoSpace = z.infer<typeof ZodMongoSpaceSchema>;
export type MongoSpace = z.input<typeof ZodMongoSpaceSchema>;

export type SpaceQueryProp = z.input<typeof ZodSpaceQueryPropSchema>;

export type SpaceQueryPropNonId = z.input<typeof ZodSpaceQueryPropNonIdSchema>;
