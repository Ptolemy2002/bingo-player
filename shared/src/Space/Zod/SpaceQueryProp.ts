import { z } from "zod";
import { SpaceQueryPropEnum } from "../Other";
import { swaggerRegistry } from "../../Swagger";

export const ZodSpaceQueryPropSchema = swaggerRegistry.register(
    "SpaceQueryProp",
    z.enum(SpaceQueryPropEnum, {
        message: "Invalid space query prop"
    }).openapi({
        description: "A property of a space that can be queried."
    })
);

export const ZodSpaceQueryPropNonIdSchema = swaggerRegistry.register(
    "SpaceQueryPropNonId",
    ZodSpaceQueryPropSchema.exclude(["id", "_id"])
);

export type SpaceQueryProp = z.input<typeof ZodSpaceQueryPropSchema>;
export type SpaceQueryPropNonId = z.input<typeof ZodSpaceQueryPropNonIdSchema>;