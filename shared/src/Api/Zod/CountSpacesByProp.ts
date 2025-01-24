import { swaggerRegistry } from "src/Swagger";
import { ZodGetSpacesByPropURLParamsSchema, ZodGetSpacesByPropQueryParamsSchema } from "./GetSpacesByProp";
import { ZodCountSpacesResponseBodySchema, ZodCountSpaces200ResponseBodySchema } from "./CountSpaces";
import { z } from "zod";
import { ZodCaseSensitiveQueryParamSchema, ZodCaseSensitiveShorthandQueryParamSchema, ZodAccentSensitiveQueryParamSchema, ZodAccentSensitiveShorthandQueryParamSchema, ZodMatchWholeQueryParamSchema, ZodMatchWholeShorthandQueryParamSchema, ZodInvertQueryParamSchema, ZodInvertShorthandQueryParamSchema } from "./QueryParams";

// For now, counting is a very similar operation to getting, so we can reuse schemas.
export const ZodCountSpacesByProp200ResponseBodySchema = swaggerRegistry.register("CountSpacesByProp200ResponseBody", ZodCountSpaces200ResponseBodySchema);
export const ZodCountSpacesByPropResponseBodySchema = swaggerRegistry.register("CountSpacesByPropResponseBody", ZodCountSpacesResponseBodySchema);
export const ZodCountSpacesByPropURLParamsSchema = swaggerRegistry.register("CountSpacesByPropURLParams", ZodGetSpacesByPropURLParamsSchema);
export const ZodCountSpacesByPropQueryParamsSchema = swaggerRegistry.register(
    "CountSpacesByPropQueryParams",
    z.object({
        caseSensitive: ZodCaseSensitiveQueryParamSchema,
        cs: ZodCaseSensitiveShorthandQueryParamSchema,

        accentSensitive: ZodAccentSensitiveQueryParamSchema,
        as: ZodAccentSensitiveShorthandQueryParamSchema,

        matchWhole: ZodMatchWholeQueryParamSchema,
        mw: ZodMatchWholeShorthandQueryParamSchema,

        invert: ZodInvertQueryParamSchema,
        i: ZodInvertShorthandQueryParamSchema
    })
    .transform((data) => {
        if (data.cs !== undefined) data.caseSensitive = data.cs;
        if (data.as !== undefined) data.accentSensitive = data.as;
        if (data.mw !== undefined) data.matchWhole = data.mw;
        if (data.i !== undefined) data.invert = data.i;
        return data;
    })
);

export type CountSpacesByPropURLParams = z.infer<typeof ZodCountSpacesByPropURLParamsSchema>;
export type CountSpacesByProp200ResponseBody = z.infer<typeof ZodCountSpacesByProp200ResponseBodySchema>;
export type CountSpacesByPropResponseBody = z.infer<typeof ZodCountSpacesByPropResponseBodySchema>;
export type CountSpacesByPropQueryParamsInput = z.input<typeof ZodCountSpacesByPropQueryParamsSchema>;
export type CountSpacesByPropQueryParamsOutput = z.infer<typeof ZodCountSpacesByPropQueryParamsSchema>;