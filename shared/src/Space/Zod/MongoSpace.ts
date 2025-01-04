import { z } from "zod";
import { ZodCleanSpaceSchema, ZodCleanSpaceShape, ZodSpaceSchema } from "./Space";
import { swaggerRegistry } from "src/Swagger";
import { ZodSpaceIDSchema } from "./SpaceID";

const Zod_id = z.object({
    _id: ZodSpaceIDSchema
});

export const ZodCleanMongoSpaceSchema = swaggerRegistry.register(
    "CleanMongoSpace",
    ZodCleanSpaceSchema.omit({ id: true })
    .merge(Zod_id).openapi({
        description: "The MongoDB representation of a Space."
    })
);
export const ZodCleanMongoSpaceShape = ZodCleanMongoSpaceSchema._def.shape;

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