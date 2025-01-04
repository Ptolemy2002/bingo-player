import { swaggerRegistry } from 'src/Swagger';
import {
    ZodListSpaceProp200ResponseBodySchema,
    ZodListSpacePropParamsSchema,
    ZodListSpacePropQueryParamsSchema,
    ZodListSpacePropResponseBodySchema,
} from './ListSpaceProp';
import { z } from 'zod';
import {
    ZodCaseSensitiveQueryParamSchema,
    ZodCaseSensitiveShorthandQueryParamSchema,
    ZodAccentSensitiveQueryParamSchema,
    ZodAccentSensitiveShorthandQueryParamSchema,
    ZodMatchWholeQueryParamSchema,
    ZodMatchWholeShorthandQueryParamSchema,
    ZodInvertQueryParamSchema,
    ZodInvertShorthandQueryParamSchema,
} from './QueryParams';
import { ZodGetSpacesByPropParamsSchema } from './GetSpacesByProp';

export const ZodListSpacePropByPropParamsSchema = swaggerRegistry.register(
    'ListSpacePropByPropParams',
    ZodListSpacePropParamsSchema.omit({ prop: true })
        .merge(
            z.object({
                listProp: ZodListSpacePropParamsSchema.shape.prop,
            })
        )
        .merge(ZodGetSpacesByPropParamsSchema.omit({ prop: true }))
        .merge(
            z.object({
                queryProp: ZodListSpacePropParamsSchema.shape.prop,
            })
        )
        .openapi({
            description: 'URL Parameters for listing all values of a property for a subset of spaces.',
        })
);

export const ZodListSpacePropByPropQueryParamsSchema = swaggerRegistry.register(
    'ListSpacePropByPropParams',
    z.intersection(
        ZodListSpacePropQueryParamsSchema,
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
            if (data.cs) data.caseSensitive = data.cs;
            if (data.as) data.accentSensitive = data.as;
            if (data.mw) data.matchWhole = data.mw;
            if (data.i) data.invert = data.i;
            return data;
        }),
    )
    .openapi({
        description:
            'Query parameters for listing all values under a property for a subset of spaces.',
    })
);

export const ZodListSpacePropByProp200ResponseBodySchema = swaggerRegistry.register(
    'ListSpacePropByProp200ResponseBody',
    ZodListSpaceProp200ResponseBodySchema,
);
export const ZodListSpacePropByPropResponseBodySchema = swaggerRegistry.register(
    'ListSpacePropByPropResponseBody',
    ZodListSpacePropResponseBodySchema,
);

export type ListSpacePropByPropParams = z.infer<typeof ZodListSpacePropByPropParamsSchema>;
export type ListSpacePropByPropQueryParams = z.infer<
    typeof ZodListSpacePropByPropQueryParamsSchema
>;

export type ListSpacePropByProp200ResponseBody = z.infer<
    typeof ZodListSpacePropByProp200ResponseBodySchema
>;
export type ListSpacePropByPropResponseBody = z.infer<
    typeof ZodListSpacePropByPropResponseBodySchema
>;
