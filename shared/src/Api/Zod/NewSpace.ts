import { swaggerRegistry } from "src/Swagger";
import { zodSuccessResponseSchema } from "./SuccessResponse";
import { ZodErrorResponseSchema } from "./ErrorResponse";
import { z } from "zod";
import { ZodCleanMongoSpaceSchema, ZodMongoSpaceSchema } from "src/Space";

export const ZodNewSpaceRequestBodySchema = swaggerRegistry.register(
    "NewSpaceRequestBody",
    z.object({
        space: ZodMongoSpaceSchema.omit({ _id: true })
    }).openapi({
        description: "The request body for creating a new space"
    })
);

export const ZodNewSpace200ResponseBodySchema = swaggerRegistry.register(
    "NewSpace200ResponseBody",
    zodSuccessResponseSchema(
        z.object({
            space: ZodCleanMongoSpaceSchema
                .openapi({
                    description: "The newly created space."
                })
        })
    ).openapi({
        description: "The response from creating a new space."
    })
);

export const ZodNewSpaceResponseBodySchema = swaggerRegistry.register(
    "NewSpaceResponseBody",
    z.union([
        ZodNewSpace200ResponseBodySchema,
        ZodErrorResponseSchema
    ])
);

export type NewSpaceRequestBody = z.infer<typeof ZodNewSpaceRequestBodySchema>;
export type NewSpace200ResponseBody = z.infer<typeof ZodNewSpace200ResponseBodySchema>;
export type NewSpaceResponseBody = z.infer<typeof ZodNewSpaceResponseBodySchema>;