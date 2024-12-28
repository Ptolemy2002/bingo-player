import { z } from "zod";
import { swaggerRegistry } from "src/Swagger";
import { zodSuccessResponseSchema } from "./SuccessResponse";
import { ZodErrorResponseSchema } from "./ErrorResponse";

export const ZodCountSpaces200ResponseBodySchema = swaggerRegistry.register(
    "CountSpaces200ResponseBody",
    zodSuccessResponseSchema(z.object({
        count: z.number()
        .min(0)
        .openapi({
            description: "The number of spaces that match the query."
        })
    })).openapi({
        description: "The response from counting spaces."
    })
);

export const ZodCountSpacesResponseBodySchema = swaggerRegistry.register(
    "CountSpacesResponseBody",
    z.union([
        ZodCountSpaces200ResponseBodySchema,
        ZodErrorResponseSchema
    ])
);

export type CountSpaces200ResponseBody = z.infer<typeof ZodCountSpaces200ResponseBodySchema>;
export type CountSpacesResponseBody = z.infer<typeof ZodCountSpacesResponseBodySchema>;