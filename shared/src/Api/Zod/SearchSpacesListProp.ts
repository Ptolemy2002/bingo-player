import { ZodSpaceQueryPropSchema } from "src/Space";
import { swaggerRegistry } from "src/Swagger";
import { z } from "zod";
import { ZodErrorResponseSchema } from "./ErrorResponse";
import { zodSuccessResponseSchema } from "./SuccessResponse";
import { ZodLimitQueryParamSchema, ZodLimitShorthandQueryParamSchema, ZodOffsetQueryParamSchema, ZodOffsetShorthandQueryParamSchema, ZodSearchListPropSortByQueryParamSchema, ZodSearchListPropSortByShorthandQueryParamSchema, ZodSortOrderDescDefaultQueryParamSchema, ZodSortOrderDescDefaultShorthandQueryParamSchema } from "./QueryParams";

export const ZodSearchSpacesListPropURLParamsSchema = swaggerRegistry.register(
    "SearchSpacesListPropURLParams",
    z.object({
        prop: ZodSpaceQueryPropSchema,
        query: z.string().openapi({
            description: "The query to search for."
        })
    }).openapi({
        description: "URL Parameters for listing all values of a property."
    })
);
export const ZodSearchSpacesListPropURLParamsShape = ZodSearchSpacesListPropURLParamsSchema.shape;

export const ZodSearchSpacesListProp200ResponseBodySchema = swaggerRegistry.register(
    "SearchSpacesListProp200ResponseBody",
    zodSuccessResponseSchema(
        z.object({
            values: z.array(
                z.object({
                    value: z.union([z.string(), z.null()]).openapi({
                        description: "The value of the property."
                    }),
                    _score: z.number().openapi({
                        description: "The relevance score of the value."
                    })
                })
            ).openapi({
                description: "The values found and their relevance scores."
            })
        }).openapi({
            description: "List of values found"
        })
    )
);

export const ZodSearchSpacesListPropResponseBodySchema = swaggerRegistry.register(
    "SearchSpacesListPropResponseBody",
    z.union([
        ZodSearchSpacesListProp200ResponseBodySchema,
        ZodErrorResponseSchema
    ])
);

export const ZodSearchSpacesListPropQueryParamsSchema = swaggerRegistry.register(
    "SearchSpacesListPropQueryParams",
    z.object({
        limit: ZodLimitQueryParamSchema,
        l: ZodLimitShorthandQueryParamSchema,

        offset: ZodOffsetQueryParamSchema.default(0),
        o: ZodOffsetShorthandQueryParamSchema,

        sortOrder: ZodSortOrderDescDefaultQueryParamSchema.default("desc"),
        so: ZodSortOrderDescDefaultShorthandQueryParamSchema,

        sortBy: ZodSearchListPropSortByQueryParamSchema.default("score"),
        sb: ZodSearchListPropSortByShorthandQueryParamSchema
    }).transform((data) => {
        if (data.l !== undefined) data.limit = data.l;
        if (data.o !== undefined) data.offset = data.o;
        if (data.so !== undefined) data.sortOrder = data.so;
        if (data.sb !== undefined) data.sortBy = data.sb;
        return data;
    }).openapi({
        description: "Query parameters for searching spaces."
    })
);

export type SearchSpacesListProp200ResponseBody = z.infer<typeof ZodSearchSpacesListProp200ResponseBodySchema>;
export type SearchSpacesListPropResponseBody = z.infer<typeof ZodSearchSpacesListPropResponseBodySchema>;

export type SearchSpacesListPropURLParams = z.input<typeof ZodSearchSpacesListPropURLParamsSchema>;

export type SearchSpacesListPropQueryParamsInput = z.input<typeof ZodSearchSpacesListPropQueryParamsSchema>;
export type SearchSpacesListPropQueryParamsOutput = z.output<typeof ZodSearchSpacesListPropQueryParamsSchema>;