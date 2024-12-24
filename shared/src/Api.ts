import { z } from "zod";
import { ZodCoercedBoolean } from "@ptolemy2002/regex-utils";
import {CleanMongoSpace, SpaceQueryProp, ZodSpaceQueryPropNonIdSchema, ZodSpaceQueryPropSchema} from "./Space";

export type ErrorCode =
    "UNKNOWN" |
    "BAD_INPUT" |
    "BAD_URL" |
    "BAD_QUERY" |
    "BAD_BODY" |
    "INTERNAL" |
    "NOT_FOUND" |
    "NOT_IMPLEMENTED"
;
export const SwaggerErrorCodeSchema = {
    "@enum": [
        "UNKNOWN",
        "BAD_INPUT",
        "BAD_URL",
        "BAD_QUERY",
        "BAD_BODY",
        "INTERNAL",
        "NOT_FOUND",
        "NOT_IMPLEMENTED"
    ]
};

export type ErrorResponse = {ok: false, code: ErrorCode, message: string | string[] | null, help?: string};
export const SwaggerErrorResponseSchema = {
    type: "object",
    properties: {
        ok: {
            type: "boolean",
            required: true,
            enum: [false]
        },
        code: {
            type: "string",
            required: true,
            enum: SwaggerErrorCodeSchema["@enum"]
        },

        message: {
            oneOf: [
                {type: "string"},
                {type: "array", items: {type: "string"}},
                {type: "null"}
            ],
            required: true
        },
        help: {
            oneOf: [
                {type: "string"},
                {type: "null"}
            ],
            required: false
        }
    }
};

export type SuccessResponse<T={}> = T & {ok: true, help?: string};

export type GetSpacesResponseBody = SuccessResponse<{spaces: CleanMongoSpace[]}> | ErrorResponse;
export type GetSpacesByPropParams = {prop: Omit<SpaceQueryProp, "id" | "_id">, query: string};

export const ZodGetSpacesByPropParamsSchema = z.object({
    prop: ZodSpaceQueryPropNonIdSchema,
    query: z.string()
});

export const ZodGetSpacesQueryParamsSchema = z.object({
    limit: z.coerce.number().int().optional(),
    l: z.coerce.number().int().optional(),

    offset: z.coerce.number().int().optional(),
    o: z.coerce.number().int().optional()
}).transform((data) => {
    if (data.l) data.limit = data.l;
    if (data.o) data.offset = data.o;
    return data;
});
export type GetSpacesQueryParams = z.input<typeof ZodGetSpacesQueryParamsSchema>;

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
export type GetSpacesByPropQueryParamsInput = z.input<typeof ZodGetSpacesByPropQueryParamsSchema>;
export type GetSpacesByPropQueryParamsOutput = z.infer<typeof ZodGetSpacesByPropQueryParamsSchema>;

export type CountSpacesResponseBody = SuccessResponse<{count: number}> | ErrorResponse;
export type ListPropResponseBody = SuccessResponse<{values: (string | null)[]}> | ErrorResponse;

export const ZodListPropParamsSchema = z.object({
    prop: ZodSpaceQueryPropSchema
});
export const ZodListPropParamsShape = ZodListPropParamsSchema.shape;
export type ListPropParams = z.input<typeof ZodListPropParamsSchema>;