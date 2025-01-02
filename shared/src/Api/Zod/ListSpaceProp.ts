import { swaggerRegistry } from "src/Swagger";
import { z } from "zod";
import { ZodSpaceQueryPropSchema } from "src/Space";
import { ZodErrorResponseSchema } from "./ErrorResponse";
import { zodSuccessResponseSchema } from "./SuccessResponse";
import { ZodLimitQueryParamSchema, ZodLimitShorthandQueryParamSchema, ZodOffsetQueryParamSchema, ZodOffsetShorthandQueryParamSchema, ZodSortByQueryParamSchema, ZodSortByShorthandQueryParamSchema, ZodSortOrderQueryParamSchema, ZodSortOrderShorthandQueryParamSchema } from "./QueryParams";

export const ZodListSpacePropParamsSchema = swaggerRegistry.register(
    "ListSpacePropParams",
    z.object({
        prop: ZodSpaceQueryPropSchema
    }).openapi({
        description: "Parameters for listing all values of a property."
    })
);
export const ZodListSpacePropParamsShape = ZodListSpacePropParamsSchema.shape;

export const ZodListSpacePropQueryParamsSchema = swaggerRegistry.register(
    "ListSpacePropQueryParams",
    z.object({
        limit: ZodLimitQueryParamSchema,
        l: ZodLimitShorthandQueryParamSchema,

        offset: ZodOffsetQueryParamSchema,
        o: ZodOffsetShorthandQueryParamSchema,

        sortOrder: ZodSortOrderQueryParamSchema,
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

export type ListSpacePropParams = z.input<typeof ZodListSpacePropParamsSchema>;
export type ListSpacePropQueryParams = z.input<typeof ZodListSpacePropQueryParamsSchema>;

export type ListSpaceProp200ResponseBody = z.infer<typeof ZodListSpaceProp200ResponseBodySchema>;
export type ListSpacePropResponseBody = z.infer<typeof ZodListSpacePropResponseBodySchema>;