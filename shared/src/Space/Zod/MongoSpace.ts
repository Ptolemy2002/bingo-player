import { Types } from "mongoose";
import { z } from "zod";
import { ZodCleanSpaceSchema, ZodCleanSpaceShape, ZodSpaceSchema } from "./Space";
import { swaggerRegistry } from "src/Swagger";

const Zod_id = z.object({
    _id: z.string()
        .refine((id) => Types.ObjectId.isValid(id), { message: "Invalid _id" })
        .openapi({
            description: "The ID of the space.",
            example: "abc123"
        })
});

export const ZodCleanMongoSpaceSchema = swaggerRegistry.register(
    "CleanMongoSpace",
    ZodCleanSpaceSchema.omit({ id: true })
    .merge(Zod_id)
    .refine(data => Types.ObjectId.isValid(data._id), {
        message: "Invalid _id"
    }).openapi({
        description: "The MongoDB representation of a Space."
    })
);
export const ZodCleanMongoSpaceShape = ZodCleanMongoSpaceSchema._def.schema.shape;

export const ZodMongoSpaceSchema = swaggerRegistry.register(
    "MongoSpace",
    ZodSpaceSchema.omit({ id: true })
    .merge(Zod_id)
    .openapi({
        description: "CleanMongoSpace, but with some fields optional and provided sensible defaults."
    })
);
export const ZodMongoSpaceShape = ZodMongoSpaceSchema._def.shape;

export type CleanMongoSpace = z.infer<typeof ZodCleanMongoSpaceSchema>;
export type MongoSpace = z.input<typeof ZodMongoSpaceSchema>;