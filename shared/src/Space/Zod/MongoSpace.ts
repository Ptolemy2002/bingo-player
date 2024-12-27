import { Types } from "mongoose";
import { z } from "zod";
import { ZodSpaceSchema } from "./Space";
import { swaggerRegistry } from "../../Swagger";

export const ZodMongoSpaceSchema = swaggerRegistry.register(
    "MongoSpace",
    ZodSpaceSchema.omit({ id: true })
    .merge(z.object({
        _id: z.string()
            .openapi({
                description: "The ID of the space.",
                example: "abc123"
            })
    }))
    .refine(data => Types.ObjectId.isValid(data._id), {
        message: "Invalid _id"
    }).openapi({
        description: "The MongoDB representation of a Space."
    })
);
export const ZodMongoSpaceShape = ZodMongoSpaceSchema._def.schema.shape;

export type CleanMongoSpace = z.infer<typeof ZodMongoSpaceSchema>;
export type MongoSpace = z.input<typeof ZodMongoSpaceSchema>;