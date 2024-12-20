import { z } from "zod";
import { Types } from "mongoose";

export const ZodSpaceSchema = z.object({
    id: z.string(),
    name: z.string().trim().min(1, {message: "name must be at least 1 non-whitespace character long"}),
    description: z.string().nullable(),
    examples: z.array(z.string().trim().min(1, {message: "examples must be at least 1 non-whitespace character long"})).default([]),
    aliases: z.array(z.string().trim().min(1, {message: "aliases must be at least 1 non-whitespace character long"})).default([]),
    tags: z.array(
        z.string().trim().regex(/^[a-zA-Z0-9_-]+$/, {
            message: "Invalid tag"
        })
        .toLowerCase()
    ).default([])
});
export type Space = z.infer<typeof ZodSpaceSchema>;
export const ZodSpaceShape = ZodSpaceSchema.shape;

export const ZodMongoSpaceSchema =
    ZodSpaceSchema.omit({ id: true })
    .merge(z.object({ _id: z.string() }))
    .refine(data => Types.ObjectId.isValid(data._id), {
        message: "Invalid _id"
    })
;
export type MongoSpace = z.infer<typeof ZodMongoSpaceSchema>;
export const ZodMongoSpaceShape = ZodMongoSpaceSchema._def.schema.shape;