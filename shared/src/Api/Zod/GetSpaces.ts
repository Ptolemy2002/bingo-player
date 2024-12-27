import { swaggerRegistry } from "src/Swagger";
import { z } from "zod";
import { ZodMongoSpaceSchema } from "src/Space";
import { ZodErrorResponseSchema } from "./ErrorResponse";
import { zodSuccessResponseSchema } from "./SuccessResponse";

export const ZodGetSpaces200ResponseBodySchema = swaggerRegistry.register(
    "GetSpaces200ResponseBody",
    zodSuccessResponseSchema(
        z.object({
            spaces: z.array(ZodMongoSpaceSchema).openapi({
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
        limit: z.coerce.number().int()
            .min(1, "limit must be non-negative and non-zero")
            .optional()
            .openapi({
                description: "The maximum number of spaces to return. Must be a positive integer and non-zero.",
                example: 10
            }),
        l: z.coerce.number().int()
            .min(1, "limit must be non-negative and non-zero")
            .optional()
            .openapi({
                description: "Shorthand for limit.",
                example: 10
            }),

        offset: z.coerce.number().int()
            .positive()
            .optional()
            .openapi({
                description: "The number of spaces to skip before returning results. Must be a non-negative integer.",
                default: 0
            }),
        o: z.coerce.number().int()
            .positive()
            .optional()
            .openapi({
                description: "Shorthand for offset.",
                default: 0
            }),
    }).transform((data) => {
        if (data.l) data.limit = data.l;
        if (data.o) data.offset = data.o;
        return data;
    }).openapi({
        description: "Query parameters for getting all spaces."
    })
);

export type GetSpaces200ResponseBody = z.infer<typeof ZodGetSpaces200ResponseBodySchema>;
export type GetSpacesResponseBody = z.infer<typeof ZodGetSpacesResponseBodySchema>;
export type GetSpacesQueryParams = z.input<typeof ZodGetSpacesQueryParamsSchema>;