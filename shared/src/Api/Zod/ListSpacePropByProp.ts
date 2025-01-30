import { swaggerRegistry } from 'src/Swagger';
import {
    ZodListSpaceProp200ResponseBodySchema,
    ZodListSpacePropURLParamsSchema,
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
import { ZodGetSpacesByPropURLParamsSchema } from './GetSpacesByProp';

export const ZodListSpacePropByPropURLParamsSchema = swaggerRegistry.register(
    'ListSpacePropByPropURLParams',
    ZodListSpacePropURLParamsSchema.omit({ prop: true })
        .merge(
            z.object({
                listProp: ZodListSpacePropURLParamsSchema.shape.prop,
            })
        )
        .merge(ZodGetSpacesByPropURLParamsSchema.omit({ prop: true }))
        .merge(
            z.object({
                queryProp: ZodListSpacePropURLParamsSchema.shape.prop,
            })
        )
        .openapi({
            description: 'URL Parameters for listing all values of a property for a subset of spaces.',
        })
);

export const ZodListSpacePropByPropQueryParamsSchema = swaggerRegistry.register(
    'ListSpacePropByPropURLParams',
    z.intersection(
        ZodListSpacePropQueryParamsSchema,
        z.object({
            caseSensitive: ZodCaseSensitiveQueryParamSchema.default('n'),
            cs: ZodCaseSensitiveShorthandQueryParamSchema,

            accentSensitive: ZodAccentSensitiveQueryParamSchema.default('n'),
            as: ZodAccentSensitiveShorthandQueryParamSchema,

            matchWhole: ZodMatchWholeQueryParamSchema.default('n'),
            mw: ZodMatchWholeShorthandQueryParamSchema,

            invert: ZodInvertQueryParamSchema.default('n'),
            i: ZodInvertShorthandQueryParamSchema
        })
        .transform((data) => {
            if (data.cs !== undefined) data.caseSensitive = data.cs;
            if (data.as !== undefined) data.accentSensitive = data.as;
            if (data.mw !== undefined) data.matchWhole = data.mw;
            if (data.i !== undefined) data.invert = data.i;
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

export type ListSpacePropByPropURLParams = z.infer<typeof ZodListSpacePropByPropURLParamsSchema>;

export type ListSpacePropByPropQueryParamsInput = z.input<
    typeof ZodListSpacePropByPropQueryParamsSchema
>;

export type ListSpacePropByPropQueryParamsOutput = z.output<
    typeof ZodListSpacePropByPropQueryParamsSchema
>;

export type ListSpacePropByProp200ResponseBody = z.infer<
    typeof ZodListSpacePropByProp200ResponseBodySchema
>;
export type ListSpacePropByPropResponseBody = z.infer<
    typeof ZodListSpacePropByPropResponseBodySchema
>;
