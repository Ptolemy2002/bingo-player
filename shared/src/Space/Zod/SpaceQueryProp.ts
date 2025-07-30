import { z } from "zod";
import { SpaceQueryPropEnum, SpaceQueryPropWithScoreEnum } from "src/Space/Other";
import { swaggerRegistry } from "src/Swagger";

export const ZodSpaceQueryPropSchema = swaggerRegistry.register(
    "SpaceQueryProp",
    z.enum(SpaceQueryPropEnum, {
        error: "Invalid space query prop"
    }).openapi({
        description: "A property of a space that can be queried."
    })
);

export const ZodSpaceQueryPropNonIdSchema = swaggerRegistry.register(
    "SpaceQueryPropNonId",
    ZodSpaceQueryPropSchema.exclude(["id", "_id"]).openapi({
        description: "A property of a space that can be queried, excluding id."
    })
);

export const ZodSpaceQueryPropWithScoreSchema = swaggerRegistry.register(
    "SpaceQueryPropWithScore",
    z.enum(SpaceQueryPropWithScoreEnum).openapi({
        description: "A property of a space that can be queried, including the score."
    })
);

export const ZodSpaceQueryPropNonIdWithScoreSchema = swaggerRegistry.register(
    "SpaceQueryPropNonIdWithScore",
    ZodSpaceQueryPropWithScoreSchema.exclude(["id", "_id"]).openapi({
        description: "A property of a space that can be queried, excluding id, including the score."
    })
);

export type SpaceQueryProp = z.input<typeof ZodSpaceQueryPropSchema>;
export type SpaceQueryPropNonId = z.input<typeof ZodSpaceQueryPropNonIdSchema>;
export type SpaceQueryPropWithScore = z.input<typeof ZodSpaceQueryPropWithScoreSchema>;
export type SpaceQueryPropNonIdWithScore = z.input<typeof ZodSpaceQueryPropNonIdWithScoreSchema>;