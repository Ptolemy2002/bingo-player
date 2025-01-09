import { swaggerRegistry } from "src/Swagger";
import { zodSuccessResponseSchema } from "./SuccessResponse";
import { ZodErrorResponseSchema } from "./ErrorResponse";
import { z } from "zod";
import { ZodCleanMongoSpaceSchema, ZodSpaceIDSchema } from "src/Space";

export const ZodDuplicatSpaceByIDURLParamsSchema = swaggerRegistry.register(
    "DuplicateSpaceByIDURLParams",
    z.object({
        id: ZodSpaceIDSchema
    }).openapi({
        description: "The URL parameters for duplicating a space."
    })
);

export const ZodDuplicateSpaceByID200ResponseBodySchema = swaggerRegistry.register(
    "DuplicateSpaceByID200ResponseBody",
    zodSuccessResponseSchema(
        z.object({
            space: ZodCleanMongoSpaceSchema.openapi({
                description: "The duplicated space."
            })
        }).openapi({
            description: "The response from duplicating a space."
        })
    )
);

export const ZodDuplicateSpaceByIDResponseBodySchema = swaggerRegistry.register(
    "DuplicateSpaceByIDResponseBody",
    z.union([
        ZodDuplicateSpaceByID200ResponseBodySchema,
        ZodErrorResponseSchema
    ])
);

export type DuplicateSpaceByIDURLParams = z.input<typeof ZodDuplicatSpaceByIDURLParamsSchema>;
export type DuplicateSpaceByID200ResponseBody = z.infer<typeof ZodDuplicateSpaceByID200ResponseBodySchema>;
export type DuplicateSpaceByIDResponseBody = z.infer<typeof ZodDuplicateSpaceByIDResponseBodySchema>;