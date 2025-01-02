import { swaggerRegistry } from "src/Swagger";
import { z } from "zod";
import { ZodCleanMongoSpaceSchema } from "src/Space";
import { ZodErrorResponseSchema } from "./ErrorResponse";
import { zodSuccessResponseSchema } from "./SuccessResponse";
import { Types } from "mongoose";

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

export const ZodGetSpaceByExactIDParamsSchema = swaggerRegistry.register(
    "GetSpaceByExactIDParams",
    z.object({
        id: z.string()
            .refine((id) => Types.ObjectId.isValid(id), { message: "Invalid ID" })
            .openapi({
                description: "The ID of the space to get."
            })
    }).openapi({
        description: "The ID of the space to get."
    })
);

export type GetSpaceByExactID200ResponseBody = z.infer<typeof ZodGetSpaceByExactID200ResponseBodySchema>;
export type GetSpaceByExactIDResponseBody = z.infer<typeof ZodGetSpacesByExactIDResponseBodySchema>;

export type GetSpaceByExactIDParams = z.infer<typeof ZodGetSpaceByExactIDParamsSchema>;