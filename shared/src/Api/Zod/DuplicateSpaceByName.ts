import { swaggerRegistry } from "src/Swagger";
import { ZodErrorResponseSchema } from "./ErrorResponse";
import { z } from "zod";
import { ZodDuplicateSpaceByID200ResponseBodySchema } from "./DuplicateSpaceByID";

export const ZodDuplicatSpaceByNameURLParamsSchema = swaggerRegistry.register(
    "DuplicateSpaceByNameURLParams",
    z.object({
        name: z.string()
    }).openapi({
        description: "The URL parameters for duplicating a space."
    })
);

export const ZodDuplicateSpaceByName200ResponseBodySchema = swaggerRegistry.register(
    "DuplicateSpaceByName200ResponseBody",
    ZodDuplicateSpaceByID200ResponseBodySchema
);

export const ZodDuplicateSpaceByNameResponseBodySchema = swaggerRegistry.register(
    "DuplicateSpaceByNameResponseBody",
    z.union([
        ZodDuplicateSpaceByName200ResponseBodySchema,
        ZodErrorResponseSchema
    ])
);

export type DuplicateSpaceByNameURLParams = z.input<typeof ZodDuplicatSpaceByNameURLParamsSchema>;
export type DuplicateSpaceByName200ResponseBody = z.infer<typeof ZodDuplicateSpaceByName200ResponseBodySchema>;
export type DuplicateSpaceByNameResponseBody = z.infer<typeof ZodDuplicateSpaceByNameResponseBodySchema>;