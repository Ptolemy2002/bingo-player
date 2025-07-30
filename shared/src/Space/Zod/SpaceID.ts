import { Types } from "mongoose";
import { swaggerRegistry } from "src/Swagger";
import { z } from "zod";

export const ZodSpaceIDSchema = swaggerRegistry.register(
    "SpaceID",
    z.string()
        .refine((id) => Types.ObjectId.isValid(id), { error: "Invalid ID" })
        .openapi({
            description: "The ID of a space.",
            example: "abc123"
        })
);

export type SpaceID = z.infer<typeof ZodSpaceIDSchema>;