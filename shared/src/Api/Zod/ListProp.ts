import { swaggerRegistry } from "src/Swagger";
import { z } from "zod";
import { ZodSpaceQueryPropNonIdSchema } from "src/Space";
import { ZodErrorResponseSchema } from "./ErrorResponse";
import { zodSuccessResponseSchema } from "./SuccessResponse";
import { ZodLimitQueryParamSchema, ZodLimitShorthandQueryParamSchema, ZodOffsetQueryParamSchema, ZodOffsetShorthandQueryParamSchema } from "./QueryParams";

export const ZodListPropParamsSchema = swaggerRegistry.register(
    "ListPropParams",
    z.object({
        prop: ZodSpaceQueryPropNonIdSchema
    }).openapi({
        description: "Parameters for listing all values of a property."
    })
);
export const ZodListPropParamsShape = ZodListPropParamsSchema.shape;

export const ZodListPropQueryParamsSchema = swaggerRegistry.register(
    "ListPropQueryParams",
    z.object({
        limit: ZodLimitQueryParamSchema,
        l: ZodLimitShorthandQueryParamSchema,

        offset: ZodOffsetQueryParamSchema,
        o: ZodOffsetShorthandQueryParamSchema,
    }).transform((data) => {
        if (data.l !== undefined) data.limit = data.l;
        if (data.o !== undefined) data.offset = data.o;
        return data;
    }).openapi({
        description: "Query parameters for listing all values under a property."
    })
);

export const ZodListProp200ResponseBodySchema = swaggerRegistry.register(
    "ListProp200ResponseBody",
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

export const ZodListPropResponseBodySchema = swaggerRegistry.register(
    "ListPropResponseBody",
    z.union([
        ZodListProp200ResponseBodySchema,
        ZodErrorResponseSchema
    ])
);

export type ListPropParams = z.input<typeof ZodListPropParamsSchema>;
export type ListPropQueryParams = z.input<typeof ZodListPropQueryParamsSchema>;

export type ListProp200ResponseBody = z.infer<typeof ZodListProp200ResponseBodySchema>;
export type ListPropResponseBody = z.infer<typeof ZodListPropResponseBodySchema>;