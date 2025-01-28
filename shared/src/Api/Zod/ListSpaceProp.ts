import { swaggerRegistry } from "src/Swagger";
import { z } from "zod";
import { ZodSpaceQueryPropSchema } from "src/Space";
import { ZodErrorResponseSchema } from "./ErrorResponse";
import { zodSuccessResponseSchema } from "./SuccessResponse";
import { ZodLimitQueryParamSchema, ZodLimitShorthandQueryParamSchema, ZodOffsetQueryParamSchema, ZodOffsetShorthandQueryParamSchema, ZodSortByQueryParamSchema, ZodSortByShorthandQueryParamSchema, ZodSortOrderQueryParamSchema, ZodSortOrderShorthandQueryParamSchema } from "./QueryParams";

export const ZodListSpacePropURLParamsSchema = swaggerRegistry.register(
    "ListSpacePropURLParams",
    z.object({
        prop: ZodSpaceQueryPropSchema
    }).openapi({
        description: "URL Parameters for listing all values of a property."
    })
);
export const ZodListSpacePropURLParamsShape = ZodListSpacePropURLParamsSchema.shape;

export const ZodListSpacePropQueryParamsSchema = swaggerRegistry.register(
    "ListSpacePropQueryParams",
    z.object({
        limit: ZodLimitQueryParamSchema,
        l: ZodLimitShorthandQueryParamSchema,

        offset: ZodOffsetQueryParamSchema.default(0),
        o: ZodOffsetShorthandQueryParamSchema,

        sortOrder: ZodSortOrderQueryParamSchema.default("asc"),
        so: ZodSortOrderShorthandQueryParamSchema
    }).transform((data) => {
        if (data.l !== undefined) data.limit = data.l;
        if (data.o !== undefined) data.offset = data.o;
        if (data.so !== undefined) data.sortOrder = data.so
        return data;
    }).openapi({
        description: "Query parameters for listing all values under a property."
    })
);

export const ZodListSpaceProp200ResponseBodySchema = swaggerRegistry.register(
    "ListSpaceProp200ResponseBody",
    zodSuccessResponseSchema(
        z.object({
            values: z.array(z.union([z.string(), z.null()])).openapi({
                description: "The values of the property."
            })
        }).openapi({
            description: "List of values found"
        })
    )   
);

export const ZodListSpacePropResponseBodySchema = swaggerRegistry.register(
    "ListSpacePropResponseBody",
    z.union([
        ZodListSpaceProp200ResponseBodySchema,
        ZodErrorResponseSchema
    ])
);

export type ListSpacePropURLParams = z.input<typeof ZodListSpacePropURLParamsSchema>;
export type ListSpacePropQueryParams = z.input<typeof ZodListSpacePropQueryParamsSchema>;

export type ListSpaceProp200ResponseBody = z.infer<typeof ZodListSpaceProp200ResponseBodySchema>;
export type ListSpacePropResponseBody = z.infer<typeof ZodListSpacePropResponseBodySchema>;