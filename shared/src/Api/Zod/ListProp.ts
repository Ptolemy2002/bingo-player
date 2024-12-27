import { swaggerRegistry } from "src/Swagger";
import { z } from "zod";
import { ZodSpaceQueryPropSchema } from "src/Space";
import { ZodErrorResponseSchema } from "./ErrorResponse";
import { zodSuccessResponseSchema } from "./SuccessResponse";

export const ZodListPropParamsSchema = swaggerRegistry.register(
    "ListPropParams",
    z.object({
        prop: ZodSpaceQueryPropSchema
    }).openapi({
        description: "Parameters for listing all values of a property."
    })
);
export const ZodListPropParamsShape = ZodListPropParamsSchema.shape;

export const ZodListProp200ResponseBodySchema = swaggerRegistry.register(
    "ListProp200ResponseBody",
    zodSuccessResponseSchema(
            z.object({
            values: z.array(z.union([z.string(), z.null()])).openapi({
                description: "The values of the property."
            })
        }).openapi({
            description: "List of values found"
        })
    )   
);

export const ZodListPropResponseBodySchema = swaggerRegistry.register(
    "ListPropResponseBody",
    z.union([
        ZodListProp200ResponseBodySchema,
        ZodErrorResponseSchema
    ])
);

export type ListPropParams = z.input<typeof ZodListPropParamsSchema>;

export type ListProp200ResponseBody = z.infer<typeof ZodListProp200ResponseBodySchema>;
export type ListPropResponseBody = z.infer<typeof ZodListPropResponseBodySchema>;