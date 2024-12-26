import { ZodSpaceQueryPropNonIdSchema } from "../../Space";
import { ZodGetSpacesQueryParamsSchema, ZodGetSpacesResponseBodySchema } from "./GetSpaces";
import { ZodCoercedBoolean } from "@ptolemy2002/regex-utils";
import { swaggerRegistry } from "../../Swagger";
import { z } from "zod";

export const ZodGetSpacesByPropParamsSchema = swaggerRegistry.register(
    "GetSpacesByPropParams",
    z.object({
        prop: ZodSpaceQueryPropNonIdSchema, 
        query: z.string()
    }).openapi({
        description: "Parameters for getting spaces filtered by a property value."
    })
);

export const ZodGetSpacesByPropQueryParamsSchema = swaggerRegistry.register(
    "GetSpacesByPropQueryParams",
    z.intersection(
        ZodGetSpacesQueryParamsSchema,
        z.object({
            caseSensitive: ZodCoercedBoolean
                .optional()
                .openapi({
                    description: "Whether to match the query case-sensitively. False if not provided.",
                    default: "f"
                }),
            cs: ZodCoercedBoolean
                .optional()
                    .openapi({
                    description: "Shorthand for caseSensitive.",
                    default: "f"
                }),

            accentSensitive: ZodCoercedBoolean
                .optional()
                .openapi({
                    description: "Whether to match the query accent-sensitively. False if not provided.",
                    default: "f"
                }),
            as: ZodCoercedBoolean
                .optional()
                .openapi({
                    description: "Shorthand for accentSensitive.",
                    default: "f"
                }),

            matchWhole: ZodCoercedBoolean
                .optional()
                .openapi({
                    description: "Whether to match the query as the whole string. False if not provided.",
                    default: "f"
                }),
            mw: ZodCoercedBoolean
                .optional()
                .openapi({
                    description: "Shorthand for matchWhole.",
                    default: "f"
                })
        }).transform((data) => {
            if (data.cs) data.caseSensitive = data.cs;
            if (data.as) data.accentSensitive = data.as;
            if (data.mw) data.matchWhole = data.mw;
            return data;
        })
    ).openapi({
        description: "Query parameters for getting spaces filtered by a property value."
    })
);

export const ZodGetSpacesByProp200ResponseBodySchema = swaggerRegistry.register(
    "GetSpacesByProp200ResponseBody",
    ZodGetSpacesResponseBodySchema
);
export const ZodGetSpacesByPropResponseBodySchema = swaggerRegistry.register(
    "GetSpacesByPropResponseBody",
    ZodGetSpacesResponseBodySchema
);

export type GetSpacesByProp200ResponseBody = z.infer<typeof ZodGetSpacesByProp200ResponseBodySchema>;
export type GetSpacesByPropResponseBody = z.infer<typeof ZodGetSpacesByPropResponseBodySchema>;

export type GetSpacesByPropParams = z.infer<typeof ZodGetSpacesByPropParamsSchema>;
export type GetSpacesByPropQueryParamsInput = z.input<typeof ZodGetSpacesByPropQueryParamsSchema>;
export type GetSpacesByPropQueryParamsOutput = z.infer<typeof ZodGetSpacesByPropQueryParamsSchema>;