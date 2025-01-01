import { swaggerRegistry } from "src/Swagger";
import { z } from "zod";
import { ZodCleanMongoSpaceSchema } from "src/Space";
import { ZodErrorResponseSchema } from "./ErrorResponse";
import { zodSuccessResponseSchema } from "./SuccessResponse";
import { ZodLimitQueryParamSchema, ZodLimitShorthandQueryParamSchema, ZodOffsetQueryParamSchema, ZodOffsetShorthandQueryParamSchema, ZodSortByQueryParamSchema, ZodSortByShorthandQueryParamSchema, ZodSortOrderQueryParamSchema, ZodSortOrderShorthandQueryParamSchema } from "./QueryParams";

export const ZodGetSpaces200ResponseBodySchema = swaggerRegistry.register(
    "GetSpaces200ResponseBody",
    zodSuccessResponseSchema(
        z.object({
            spaces: z.array(ZodCleanMongoSpaceSchema).openapi({
                description: "The spaces that match the query."
            })
        }).openapi({
            description: "The response from getting spaces."
        })
    )
);

export const ZodGetSpacesResponseBodySchema = swaggerRegistry.register(
    "GetSpacesResponseBody",
    z.union([
        ZodGetSpaces200ResponseBodySchema,
        ZodErrorResponseSchema
    ])
);

export const ZodGetSpacesQueryParamsSchema = swaggerRegistry.register(
    "GetSpacesQueryParams",
    z.object({
        limit: ZodLimitQueryParamSchema,
        l: ZodLimitShorthandQueryParamSchema,

        offset: ZodOffsetQueryParamSchema,
        o: ZodOffsetShorthandQueryParamSchema,

        sortBy: ZodSortByQueryParamSchema,
        sb: ZodSortByShorthandQueryParamSchema,

        sortOrder: ZodSortOrderQueryParamSchema,
        so: ZodSortOrderShorthandQueryParamSchema
    }).transform((data) => {
        if (data.l !== undefined) data.limit = data.l;
        if (data.o !== undefined) data.offset = data.o;
        if (data.sb !== undefined) data.sortBy = data.sb;
        if (data.so !== undefined) data.sortOrder = data.so;
        return data;
    }).openapi({
        description: "Query parameters for getting all spaces."
    })
);

export type GetSpaces200ResponseBody = z.infer<typeof ZodGetSpaces200ResponseBodySchema>;
export type GetSpacesResponseBody = z.infer<typeof ZodGetSpacesResponseBodySchema>;
export type GetSpacesQueryParams = z.input<typeof ZodGetSpacesQueryParamsSchema>;