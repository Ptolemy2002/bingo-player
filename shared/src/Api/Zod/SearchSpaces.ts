import { swaggerRegistry } from "src/Swagger";
import { z } from "zod";
import { ZodMongoSpaceSchema, ZodSpaceSchema } from "src/Space";
import { ZodErrorResponseSchema } from "./ErrorResponse";
import { zodSuccessResponseSchema } from "./SuccessResponse";
import { ZodLimitQueryParamSchema, ZodLimitShorthandQueryParamSchema, ZodOffsetQueryParamSchema, ZodOffsetShorthandQueryParamSchema, ZodSortByWithScoreQueryParamSchema, ZodSortByWithScoreShorthandQueryParamSchema, ZodSortOrderDescDefaultQueryParamSchema, ZodSortOrderDescDefaultShorthandQueryParamSchema } from "./QueryParams";

export const ZodScoreSpecificationSchema = swaggerRegistry.register(
    "ScoreSpecification",
    z.object({
        _score: z.number().openapi({
            description: "The relevance score of the space."
        })
    }).openapi({
        description: "A specification for a relevance score."
    })
);

export const ZodSpaceWithScoreSchema = swaggerRegistry.register(
    "SpaceWithScore",
    z.intersection(
        ZodSpaceSchema,
        ZodScoreSpecificationSchema
    ).openapi({
        description: "A space with an associated relevance score."
    })
);

export const ZodMongoSpaceWithScoreSchema = swaggerRegistry.register(
    "MongoSpaceWithScore",
    z.intersection(
        ZodMongoSpaceSchema,
        ZodScoreSpecificationSchema
    ).openapi({
        description: "The MongoDB representation of a space with an associated relevance score."
    })
);

export const ZodSearchSpacesParamsSchema = swaggerRegistry.register(
    "SearchSpacesParams",
    z.object({
        query: z.string().openapi({
            description: "The search query."
        })
    }).openapi({
        description: "The URL parameters for searching spaces."
    })
);

export const ZodSearchSpaces200ResponseBodySchema = swaggerRegistry.register(
    "SearchSpaces200ResponseBody",
    zodSuccessResponseSchema(
        z.object({
            spaces: z.array(
                ZodMongoSpaceSchema
            ).openapi({
                description: "The spaces that match the query."
            })
        }).openapi({
            description: "The response from searching spaces."
        })
    )
);

export const ZodSearchSpacesResponseBodySchema = swaggerRegistry.register(
    "SearchSpacesResponseBody",
    z.union([
        ZodSearchSpaces200ResponseBodySchema,
        ZodErrorResponseSchema
    ])
);

export const ZodSearchSpacesQueryParamsSchema = swaggerRegistry.register(
    "SearchSpacesQueryParams",
    z.object({
        limit: ZodLimitQueryParamSchema,
        l: ZodLimitShorthandQueryParamSchema,

        offset: ZodOffsetQueryParamSchema,
        o: ZodOffsetShorthandQueryParamSchema,

        sortBy: ZodSortByWithScoreQueryParamSchema,
        sb: ZodSortByWithScoreShorthandQueryParamSchema,

        sortOrder: ZodSortOrderDescDefaultQueryParamSchema,
        so: ZodSortOrderDescDefaultShorthandQueryParamSchema
    }).transform((data) => {
        if (data.l !== undefined) data.limit = data.l;
        if (data.o !== undefined) data.offset = data.o;
        if (data.sb !== undefined) data.sortBy = data.sb;
        if (data.so !== undefined) data.sortOrder = data.so;
        return data;
    }).openapi({
        description: "Query parameters for searching spaces."
    })
);

export type SpaceWithScore = z.infer<typeof ZodSpaceWithScoreSchema>;
export type MongoSpaceWithScore = z.infer<typeof ZodMongoSpaceWithScoreSchema>;

export type SearchSpaces200ResponseBody = z.infer<typeof ZodSearchSpaces200ResponseBodySchema>;
export type SearchSpacesResponseBody = z.infer<typeof ZodSearchSpacesResponseBodySchema>;

export type SearchSpacesParams = z.input<typeof ZodSearchSpacesParamsSchema>;
export type SearchSpacesQueryParams = z.input<typeof ZodSearchSpacesQueryParamsSchema>;