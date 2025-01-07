import { swaggerRegistry } from "src/Swagger";
import { zodSuccessResponseSchema } from "./SuccessResponse";
import { ZodErrorResponseSchema } from "./ErrorResponse";
import { z } from "zod";
import { parseSpacePath, ZodCleanMongoSpaceSchema, ZodSpaceIDSchema } from "src/Space";

export const ZodUpdateSpaceByIDParamsSchema = swaggerRegistry.register(
    "UpdateSpaceByIDParams",
    z.object({
        id: ZodSpaceIDSchema
    }).openapi({
        description: "The parameters for updating a space."
    })
);

export const ZodUpdateSpaceByIDRequestBodySchema = swaggerRegistry.register(
    "UpdateSpaceByIDRequestBody",
    z.object({
        difference: z.object({
            $set: z.record(
                z.string().refine((s) => parseSpacePath(s), {
                    message: "Invalid path."
                }),
                z.unknown()
            )
            .optional()
            .openapi({
                description: "The fields to set. Each key is a path to a field.",
                example: {
                    "name": "New Name",
                    "tags": ["new-tag"]
                }
            }),

            $unset: z.record(
                z.string().refine((s) => parseSpacePath(s, [{
                    key: "aliases",
                    allowDirect: false
                }, {
                    key: "examples",
                    allowDirect: false
                }, {
                    key: "tags",
                    allowDirect: false
                }]), {
                    message: "Invalid path."
                }),
                z.literal("")
            )
            .optional()
            .openapi({
                description: "The fields to unset. Each key is a path to a field. Cannot be a direct path, must be nested from a list field.",
                example: {
                    "aliases.0": ""
                }
            }),

            $push: z.record(
                z.string().refine((s) => parseSpacePath(s, [{
                    key: "aliases",
                    allowNested: false
                }, {
                    key: "examples",
                    allowNested: false
                }, {
                    key: "tags",
                    allowNested: false
                }]), {
                    message: "Invalid path."
                }),
                z.object({
                    $each: z.array(z.unknown())
                })
            )
            .optional()
            .openapi({
                description: "The values to push to a list field. Each key is a path to a field. Must be a direct path to a list field.",
                example: {
                    "tags": {
                        "$each": ["new-tag"]
                    }
                }
            }),

            $pullAll: z.record(
                z.string().refine((s) => parseSpacePath(s, [{
                    key: "aliases",
                    allowNested: false
                }, {
                    key: "examples",
                    allowNested: false
                }, {
                    key: "tags",
                    allowNested: false
                }]), {
                    message: "Invalid path."
                }),
                z.object({
                    $in: z.array(z.unknown())
                }).transform((v) => [...v.$in])
            )
            .optional()
            .openapi({
                description: "The values to pull from a list field. Each key is a path to a field. Must be a direct path to a list field.",
                example: {
                    "tags": {
                        $in: ["old-tag"]
                    }
                }
            })
        })
    }).openapi({
        description: "The request body for updating a space"
    })
);

export const ZodUpdateSpaceByID200ResponseBodySchema = swaggerRegistry.register(
    "UpdateSpaceByID200ResponseBody",
    zodSuccessResponseSchema(
        z.object({
            space: ZodCleanMongoSpaceSchema
                .openapi({
                    description: "The updated space."
                })
        })
    ).openapi({
        description: "The response from updating a space."
    })
);

export const ZodUpdateSpaceByIDResponseBodySchema = swaggerRegistry.register(
    "UpdateSpaceByIDResponseBody",
    z.union([
        ZodUpdateSpaceByID200ResponseBodySchema,
        ZodErrorResponseSchema
    ]).openapi({
        description: "The response from updating a space by ID."
    })
);

export type UpdateSpaceByID200ResponseBody = z.infer<typeof ZodUpdateSpaceByID200ResponseBodySchema>;
export type UpdateSpaceByIDResponseBody = z.infer<typeof ZodUpdateSpaceByIDResponseBodySchema>;

export type UpdateSpaceByIDRequestBodyInput = z.input<typeof ZodUpdateSpaceByIDRequestBodySchema>;
export type UpdateSpaceByIDRequestBodyOutput = z.output<typeof ZodUpdateSpaceByIDRequestBodySchema>;

export type UpdateSpaceByIDParams = z.infer<typeof ZodUpdateSpaceByIDParamsSchema>;