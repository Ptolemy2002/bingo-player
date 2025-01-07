import { swaggerRegistry } from "src/Swagger";
import { z } from "zod";
import { ZodErrorResponseSchema } from "./ErrorResponse";
import { ZodDeleteSpaceByID200ResponseBodySchema } from "./DeleteSpaceByID";

export const ZodDeleteSpaceByNameParamsSchema = swaggerRegistry.register(
    "DeleteSpaceByNameParams",
    z.object({
        name: z.string().openapi({
            description: "The name of the space to delete."
        })
    }).openapi({
        description: "Parameters for deleting a space by name."
    })
);

export const ZodDeleteSpaceByName200ResponseBodySchema = swaggerRegistry.register(
    "DeleteSpaceByName200ResponseBody",
    ZodDeleteSpaceByID200ResponseBodySchema
);

export const ZodDeleteSpaceByNameResponseBodySchema = swaggerRegistry.register(
    "DeleteSpaceByNameResponseBody",
    z.union([
        ZodDeleteSpaceByName200ResponseBodySchema,
        ZodErrorResponseSchema
    ])
);

export type DeleteSpaceByNameParams = z.input<typeof ZodDeleteSpaceByNameParamsSchema>;
export type DeleteSpaceByName200ResponseBody = z.infer<typeof ZodDeleteSpaceByName200ResponseBodySchema>;
export type DeleteSpaceByNameResponseBody = z.infer<typeof ZodDeleteSpaceByNameResponseBodySchema>;