import { swaggerRegistry } from "src/Swagger";
import { zodSuccessResponseSchema } from "./SuccessResponse";
import { ZodErrorResponseSchema } from "./ErrorResponse";
import { z } from "zod";
import { ZodUpdateSpaceByID200ResponseBodySchema, ZodUpdateSpaceByIDRequestBodySchema } from "./UpdateSpaceByID";

export const ZodUpdateSpaceByNameURLParamsSchema = swaggerRegistry.register(
    "UpdateSpaceByNameURLParams",
    z.object({
        name: z.string()
    }).openapi({
        description: "The URL parameters for updating a space."
    })
);

export const ZodUpdateSpaceByNameRequestBodySchema = swaggerRegistry.register(
    "UpdateSpaceByNameRequestBody",
    ZodUpdateSpaceByIDRequestBodySchema
);

export const ZodUpdateSpaceByName200ResponseBodySchema = swaggerRegistry.register(
    "UpdateSpaceByName200ResponseBody",
    ZodUpdateSpaceByID200ResponseBodySchema
);

export const ZodUpdateSpaceByNameErrorResponseSchema = swaggerRegistry.register(
    "UpdateSpaceByNameResponseBody",
    z.union([
        ZodUpdateSpaceByID200ResponseBodySchema,
        ZodErrorResponseSchema
    ]).openapi({
        description: "The response for updating a space by name."
    })
);

export type UpdateSpaceByName200ResponseBody = z.infer<typeof ZodUpdateSpaceByName200ResponseBodySchema>;
export type UpdateSpaceByNameResponseBody = z.infer<typeof ZodUpdateSpaceByNameErrorResponseSchema>;

export type UpdateSpaceByNameRequestBodyInput = z.input<typeof ZodUpdateSpaceByNameRequestBodySchema>;
export type UpdateSpaceByNameRequestBodyOutput = z.output<typeof ZodUpdateSpaceByNameRequestBodySchema>;

export type UpdateSpaceByNameURLParams = z.infer<typeof ZodUpdateSpaceByNameURLParamsSchema>;