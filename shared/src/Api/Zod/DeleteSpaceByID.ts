import { swaggerRegistry } from "src/Swagger";
import { z } from "zod";
import { ZodErrorResponseSchema } from "./ErrorResponse";
import { zodSuccessResponseSchema } from "./SuccessResponse";
import { ZodSpaceIDSchema } from "src/Space";

export const ZodDeleteSpaceByIDURLParamsSchema = swaggerRegistry.register(
    "DeleteSpaceByIDURLParams",
    z.object({
        id: ZodSpaceIDSchema.openapi({
            description: "The ID of the space to delete."
        })
    }).openapi({
        description: "URL Parameters for deleting a space by ID."
    })
);

export const ZodDeleteSpaceByID200ResponseBodySchema = swaggerRegistry.register(
    "DeleteSpaceByID200ResponseBody",
    zodSuccessResponseSchema(
        z.object({
            deleted: z.literal(true).openapi({
                description: "Whether the space was successfully deleted."
            })
        }).openapi({
            description: "The response from deleting a space."
        })
    )
);

export const ZodDeleteSpaceByIDResponseBodySchema = swaggerRegistry.register(
    "DeleteSpaceByIDResponseBody",
    z.union([
        ZodDeleteSpaceByID200ResponseBodySchema,
        ZodErrorResponseSchema
    ])
);

export type DeleteSpaceByIDURLParams = z.input<typeof ZodDeleteSpaceByIDURLParamsSchema>;
export type DeleteSpaceByID200ResponseBody = z.infer<typeof ZodDeleteSpaceByID200ResponseBodySchema>;
export type DeleteSpaceByIDResponseBody = z.infer<typeof ZodDeleteSpaceByIDResponseBodySchema>;