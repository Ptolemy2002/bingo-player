import { swaggerRegistry } from 'src/Swagger';
import {
    ZodListProp200ResponseBodySchema,
    ZodListPropParamsSchema,
    ZodListPropQueryParamsSchema,
    ZodListPropResponseBodySchema,
} from './ListProp';
import { z } from 'zod';
import {
    ZodCaseSensitiveQueryParamSchema,
    ZodCaseSensitiveShorthandQueryParamSchema,
    ZodAccentSensitiveQueryParamSchema,
    ZodAccentSensitiveShorthandQueryParamSchema,
    ZodMatchWholeQueryParamSchema,
    ZodMatchWholeShorthandQueryParamSchema,
} from './QueryParams';
import { ZodGetSpacesByPropParamsSchema } from './GetSpacesByProp';

export const ZodListPropByPropParamsSchema = swaggerRegistry.register(
    'ListPropByPropParams',
    ZodListPropParamsSchema.omit({ prop: true })
        .merge(
            z.object({
                listProp: ZodListPropParamsSchema.shape.prop,
            })
        )
        .merge(ZodGetSpacesByPropParamsSchema.omit({ prop: true }))
        .merge(
            z.object({
                queryProp: ZodListPropParamsSchema.shape.prop,
            })
        )
        .openapi({
            description: 'URL Parameters for listing all values of a property for a subset of spaces.',
        })
);

export const ZodListPropByPropQueryParamsSchema = swaggerRegistry.register(
    'ListPropByPropParams',
    z.intersection(
        ZodListPropQueryParamsSchema,
        z.object({
            caseSensitive: ZodCaseSensitiveQueryParamSchema,
            cs: ZodCaseSensitiveShorthandQueryParamSchema,

            accentSensitive: ZodAccentSensitiveQueryParamSchema,
            as: ZodAccentSensitiveShorthandQueryParamSchema,

            matchWhole: ZodMatchWholeQueryParamSchema,
            mw: ZodMatchWholeShorthandQueryParamSchema,
        })
        .transform((data) => {
            if (data.cs) data.caseSensitive = data.cs;
            if (data.as) data.accentSensitive = data.as;
            if (data.mw) data.matchWhole = data.mw;
            return data;
        }),
    )
    .openapi({
        description:
            'Query parameters for listing all values under a property for a subset of spaces.',
    })
);

export const ZodListPropByProp200ResponseBodySchema = swaggerRegistry.register(
    'ListPropByProp200ResponseBody',
    ZodListProp200ResponseBodySchema,
);
export const ZodListPropByPropResponseBodySchema = swaggerRegistry.register(
    'ListPropByPropResponseBody',
    ZodListPropResponseBodySchema,
);

export type ListPropByPropParams = z.infer<typeof ZodListPropByPropParamsSchema>;
export type ListPropByPropQueryParams = z.infer<
    typeof ZodListPropByPropQueryParamsSchema
>;

export type ListPropByProp200ResponseBody = z.infer<
    typeof ZodListPropByProp200ResponseBodySchema
>;
export type ListPropByPropResponseBody = z.infer<
    typeof ZodListPropByPropResponseBodySchema
>;
