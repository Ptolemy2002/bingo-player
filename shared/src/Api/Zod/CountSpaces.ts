import { z } from "zod";
import { swaggerRegistry } from "../../Swagger";
import { zodSuccessResponseSchema } from "./SuccessResponse";
import { ZodErrorResponseSchema } from "./ErrorResponse";

export const ZodCountSpaces200ResponseBody = swaggerRegistry.register(
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

export const ZodCountSpacesResponseBody = swaggerRegistry.register(
    "CountSpacesResponseBody",
    z.union([
        ZodCountSpaces200ResponseBody,
        ZodErrorResponseSchema
    ])
);

export type CountSpaces200ResponseBody = z.infer<typeof ZodCountSpaces200ResponseBody>;
export type CountSpacesResponseBody = z.infer<typeof ZodCountSpacesResponseBody>;