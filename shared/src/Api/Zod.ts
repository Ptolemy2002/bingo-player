import { z } from "zod";
import { ZodSpaceQueryPropNonIdSchema, ZodSpaceQueryPropSchema } from "../Space";
import { ZodCoercedBoolean } from "@ptolemy2002/regex-utils";

export const ZodGetSpacesByPropParamsSchema = z.object({
    prop: ZodSpaceQueryPropNonIdSchema,
    query: z.string()
});

export const ZodGetSpacesQueryParamsSchema = z.object({
    limit: z.coerce.number().int()
        .min(1, "limit must be non-negative and non-zero")
        .optional(),
    l: z.coerce.number().int()
        .min(1, "limit must be non-negative and non-zero")
        .optional(),

    offset: z.coerce.number().int()
        .min(0, "offset must be non-negative")
        .optional(),
    o: z.coerce.number().int()
        .min(0, "offset must be non-negative")
        .optional()
}).transform((data) => {
    if (data.l) data.limit = data.l;
    if (data.o) data.offset = data.o;
    return data;
});

export const ZodGetSpacesByPropQueryParamsSchema = z.intersection(
    ZodGetSpacesQueryParamsSchema,
    z.object({
        caseSensitive: ZodCoercedBoolean.optional(),
        cs: ZodCoercedBoolean.optional(),

        accentSensitive: ZodCoercedBoolean.optional(),
        as: ZodCoercedBoolean.optional(),

        matchWhole: ZodCoercedBoolean.optional(),
        mw: ZodCoercedBoolean.optional()
    }).transform((data) => {
        if (data.cs) data.caseSensitive = data.cs;
        if (data.as) data.accentSensitive = data.as;
        if (data.mw) data.matchWhole = data.mw;
        return data;
    })
);
// We can't directly get the shape of an intersection.

export const ZodListPropParamsSchema = z.object({
    prop: ZodSpaceQueryPropSchema
});
export const ZodListPropParamsShape = ZodListPropParamsSchema.shape;

export type GetSpacesQueryParams = z.input<typeof ZodGetSpacesQueryParamsSchema>;

export type GetSpacesByPropQueryParamsInput = z.input<typeof ZodGetSpacesByPropQueryParamsSchema>;
export type GetSpacesByPropQueryParamsOutput = z.infer<typeof ZodGetSpacesByPropQueryParamsSchema>;

export type ListPropParams = z.input<typeof ZodListPropParamsSchema>;