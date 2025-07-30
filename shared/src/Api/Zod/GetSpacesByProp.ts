import { ZodSpaceQueryPropNonIdSchema } from 'src/Space';
import {
    ZodGetSpaces200ResponseBodySchema,
    ZodGetSpacesQueryParamsSchema,
    ZodGetSpacesResponseBodySchema,
} from './GetSpaces';
import { swaggerRegistry } from 'src/Swagger';
import { z } from 'zod';
import {
    ZodAccentSensitiveQueryParamSchema,
    ZodAccentSensitiveShorthandQueryParamSchema,
    ZodCaseSensitiveQueryParamSchema,
    ZodCaseSensitiveShorthandQueryParamSchema,
    ZodInvertQueryParamSchema,
    ZodInvertShorthandQueryParamSchema,
    ZodMatchWholeQueryParamSchema,
    ZodMatchWholeShorthandQueryParamSchema,
} from './QueryParams';

export const ZodGetSpacesByPropURLParamsSchema = swaggerRegistry.register(
    'GetSpacesByPropURLParams',
    z.object({
            prop: ZodSpaceQueryPropNonIdSchema,
            query: z.string(),
        })
        .openapi({
            description:
                'URL Parameters for getting spaces filtered by a property value.',
        }),
);

export const ZodGetSpacesByPropQueryParamsSchema = swaggerRegistry.register(
    'GetSpacesByPropQueryParams',
    z.intersection(
        ZodGetSpacesQueryParamsSchema,
        z.object({
                caseSensitive: ZodCaseSensitiveQueryParamSchema.default(false),
                cs: ZodCaseSensitiveShorthandQueryParamSchema,

                accentSensitive: ZodAccentSensitiveQueryParamSchema.default(false),
                as: ZodAccentSensitiveShorthandQueryParamSchema,

                matchWhole: ZodMatchWholeQueryParamSchema.default(false),
                mw: ZodMatchWholeShorthandQueryParamSchema,

                invert: ZodInvertQueryParamSchema.default(false),
                i: ZodInvertShorthandQueryParamSchema,
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
            'Query parameters for getting spaces filtered by a property value.',
    }),
);

export const ZodGetSpacesByProp200ResponseBodySchema = swaggerRegistry.register(
    'GetSpacesByProp200ResponseBody',
    ZodGetSpaces200ResponseBodySchema
);
export const ZodGetSpacesByPropResponseBodySchema = swaggerRegistry.register(
    'GetSpacesByPropResponseBody',
    ZodGetSpacesResponseBodySchema,
);

export type GetSpacesByProp200ResponseBody = z.infer<
    typeof ZodGetSpacesByProp200ResponseBodySchema
>;
export type GetSpacesByPropResponseBody = z.infer<
    typeof ZodGetSpacesByPropResponseBodySchema
>;

export type GetSpacesByPropURLParams = z.infer<
    typeof ZodGetSpacesByPropURLParamsSchema
>;
export type GetSpacesByPropQueryParamsInput = z.input<
    typeof ZodGetSpacesByPropQueryParamsSchema
>;
export type GetSpacesByPropQueryParamsOutput = z.infer<
    typeof ZodGetSpacesByPropQueryParamsSchema
>;
