import { swaggerRegistry } from "src/Swagger";
import { z } from "zod";
import { ZodCleanMongoSpaceSchema, ZodCleanSpaceSchema, ZodMongoSpaceSchema, ZodSpaceSchema } from "src/Space";
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

export const ZodCleanSpaceWithScoreSchema = swaggerRegistry.register(
    "CleanSpaceWithScore",
    z.intersection(
        ZodCleanSpaceSchema,
        ZodScoreSpecificationSchema
    ).openapi({
        description: "CleanSpaceWithScore, but with some fields optional and provided sensible defaults."
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

export const ZodCleanMongoSpaceWithScoreSchema = swaggerRegistry.register(
    "CleanMongoSpaceWithScore",
    z.intersection(
        ZodCleanMongoSpaceSchema,
        ZodScoreSpecificationSchema
    ).openapi({
        description: "CleanMongoSpaceWithScore, but with some fields optional and provided sensible defaults."
    })
);

export const ZodSearchSpacesURLParamsSchema = swaggerRegistry.register(
    "SearchSpacesURLParams",
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
                ZodCleanMongoSpaceWithScoreSchema
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

        offset: ZodOffsetQueryParamSchema.default(0),
        o: ZodOffsetShorthandQueryParamSchema,

        sortBy: ZodSortByWithScoreQueryParamSchema.default("score"),
        sb: ZodSortByWithScoreShorthandQueryParamSchema,

        sortOrder: ZodSortOrderDescDefaultQueryParamSchema.default("desc"),
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
export type CleanSpaceWithScore = z.infer<typeof ZodCleanSpaceWithScoreSchema>;

export type MongoSpaceWithScore = z.infer<typeof ZodMongoSpaceWithScoreSchema>;
export type CleanMongoSpaceWithScore = z.infer<typeof ZodCleanMongoSpaceWithScoreSchema>;

export type ScoreSpecification = z.infer<typeof ZodScoreSpecificationSchema>;

export type SearchSpaces200ResponseBody = z.infer<typeof ZodSearchSpaces200ResponseBodySchema>;
export type SearchSpacesResponseBody = z.infer<typeof ZodSearchSpacesResponseBodySchema>;

export type SearchSpacesURLParams = z.input<typeof ZodSearchSpacesURLParamsSchema>;
export type SearchSpacesQueryParams = z.input<typeof ZodSearchSpacesQueryParamsSchema>;