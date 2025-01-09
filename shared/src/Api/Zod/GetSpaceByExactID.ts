import { swaggerRegistry } from "src/Swagger";
import { z } from "zod";
import { ZodCleanMongoSpaceSchema, ZodSpaceIDSchema } from "src/Space";
import { ZodErrorResponseSchema } from "./ErrorResponse";
import { zodSuccessResponseSchema } from "./SuccessResponse";

export const ZodGetSpaceByExactID200ResponseBodySchema = swaggerRegistry.register(
    "GetSpaceByExactID200ResponseBody",
    zodSuccessResponseSchema(
        z.object({
            space: ZodCleanMongoSpaceSchema.openapi({
                description: "The space that matches the query."
            })
        }).openapi({
            description: "The response from getting spaces."
        })
    )
);

export const ZodGetSpacesByExactIDResponseBodySchema = swaggerRegistry.register(
    "GetSpacesByExactIDResponseBody",
    z.union([
        ZodGetSpaceByExactID200ResponseBodySchema,
        ZodErrorResponseSchema
    ])
);

export const ZodGetSpaceByExactIDURLParamsSchema = swaggerRegistry.register(
    "GetSpaceByExactIDURLParams",
    z.object({
        id: ZodSpaceIDSchema
            .openapi({
                description: "The ID of the space to get."
            })
    }).openapi({
        description: "The URL parameters for getting a space by ID."
    })
);

export type GetSpaceByExactID200ResponseBody = z.infer<typeof ZodGetSpaceByExactID200ResponseBodySchema>;
export type GetSpaceByExactIDResponseBody = z.infer<typeof ZodGetSpacesByExactIDResponseBodySchema>;

export type GetSpaceByExactIDURLParams = z.infer<typeof ZodGetSpaceByExactIDURLParamsSchema>;