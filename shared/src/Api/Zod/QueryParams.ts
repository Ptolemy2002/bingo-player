import { z } from "zod";
import { swaggerRegistry } from "src/Swagger";
import { ZodCoercedBoolean } from "@ptolemy2002/regex-utils";
import { ZodSortOrderSchema } from "./SortOrder";
import { ZodSpaceQueryPropSchema, ZodSpaceQueryPropWithScoreSchema } from "src/Space";

export const ZodLimitQueryParamSchema = swaggerRegistry.registerParameter(
    "limit",
    z.coerce.number().int()
        .min(1, "limit must be non-negative and non-zero")
        .optional()
        .openapi({
            description:
                "[Query Parameter] The maximum number of resources to return. Must be a positive integer and non-zero."
                + " If not provided, the server will return all found resources.",
            example: 10,
            param: {
                name: "limit",
                in: "query"
            }
        })
);

export const ZodLimitShorthandQueryParamSchema = swaggerRegistry.registerParameter(
    "l",
    ZodLimitQueryParamSchema.openapi({
        description: "[Query Parameter] Shorthand for limit.",
        example: 10,
        param: {
            name: "l",
            in: "query"
        }
    })
);

export const ZodOffsetQueryParamSchema = swaggerRegistry.registerParameter(
    "offset",
    z.coerce.number().int()
        .min(0, "offset must be non-negative")
        .optional()
        .openapi({
            description: 
                "[Query Parameter] The number of spaces to skip before returning results. Must be a non-negative integer."
                + " If not provided, it will be considered 0.",
            default: 0,
            param: {
                name: "offset",
                in: "query"
            }
        })
);

export const ZodOffsetShorthandQueryParamSchema = swaggerRegistry.registerParameter(
    "o",
    ZodOffsetQueryParamSchema.openapi({
        description: "[Query Parameter] Shorthand for offset.",
        default: 0,
        param: {
            name: "o",
            in: "query"
        }
    })
);

export const ZodCaseSensitiveQueryParamSchema = swaggerRegistry.registerParameter(
    "caseSensitive",
    ZodCoercedBoolean
        .optional()
        .openapi({
            description: "[Query Parameter] Whether to match the query case-sensitively. False if not provided.",
            default: "f",
            param: {
                name: "caseSensitive",
                in: "query"
            }
        })
);

export const ZodCaseSensitiveShorthandQueryParamSchema = swaggerRegistry.registerParameter(
    "cs",
    ZodCaseSensitiveQueryParamSchema.openapi({
        description: "[Query Parameter] Shorthand for caseSensitive.",
        default: "f",
        param: {
            name: "cs",
            in: "query"
        }
    })
);

export const ZodAccentSensitiveQueryParamSchema = swaggerRegistry.registerParameter(
    "accentSensitive",
    ZodCoercedBoolean
        .optional()
        .openapi({
            description: "[Query Parameter] Whether to match the query accent-sensitively. False if not provided.",
            default: "f",
            param: {
                name: "accentSensitive",
                in: "query"
            }
        })
);

export const ZodAccentSensitiveShorthandQueryParamSchema = swaggerRegistry.registerParameter(
    "as",
    ZodAccentSensitiveQueryParamSchema.openapi({
        description: "[Query Parameter] Shorthand for accentSensitive.",
        default: "f",
        param: {
            name: "as",
            in: "query"
        }
    })
);

export const ZodMatchWholeQueryParamSchema = swaggerRegistry.registerParameter(
    "matchWhole",
    ZodCoercedBoolean
        .optional()
        .openapi({
            description: "[Query Parameter] Whether to match the query as the whole string. False if not provided.",
            default: "f",
            param: {
                name: "matchWhole",
                in: "query"
            }
        })
);

export const ZodMatchWholeShorthandQueryParamSchema = swaggerRegistry.registerParameter(
    "mw",
    ZodMatchWholeQueryParamSchema.openapi({
        description: "[Query Parameter] Shorthand for matchWhole.",
        default: "f",
        param: {
            name: "mw",
            in: "query"
        }
    })
);

export const ZodSortOrderQueryParamSchema = swaggerRegistry.registerParameter(
    "sortOrder",
    ZodSortOrderSchema
        .optional()
        .openapi({
            description: "[Query Parameter] The order to sort the field by. Ascending if not provided.",
            default: "asc",
            param: {
                name: "sortOrder",
                in: "query"
            }
        })
);

export const ZodSortOrderShorthandQueryParamSchema = swaggerRegistry.registerParameter(
    "so",
    ZodSortOrderQueryParamSchema
    .openapi({
        description: "[Query Parameter] Shorthand for sortOrder.",
        default: "asc",
        param: {
            name: "so",
            in: "query"
        }
    })
);

export const ZodSortOrderDescDefaultQueryParamSchema = swaggerRegistry.registerParameter(
    "sortOrderDescDefault",
    ZodSortOrderSchema
        .optional()
        .default("desc")
        .openapi({
            description: "[Query Parameter] The order to sort the field by. Descending by default.",
            default: "desc",
            param: {
                name: "sortOrder",
                in: "query"
            }
        })
);

export const ZodSortOrderDescDefaultShorthandQueryParamSchema = swaggerRegistry.registerParameter(
    "soDescDefault",
    ZodSortOrderDescDefaultQueryParamSchema
    .openapi({
        description: "[Query Parameter] Shorthand for sortOrder.",
        default: "desc",
        param: {
            name: "so",
            in: "query"
        }
    })
);

export const ZodSortByQueryParamSchema = swaggerRegistry.registerParameter(
    "sortBy",
    ZodSpaceQueryPropSchema
        .optional()
        .openapi({
            description: "[Query Parameter] The field to sort by. 'id' if not provided.",
            default: "id",
            param: {
                name: "sortBy",
                in: "query"
            }
        })
);

export const ZodSortByShorthandQueryParamSchema = swaggerRegistry.registerParameter(
    "sb",
    ZodSortByQueryParamSchema
    .openapi({
        description: "[Query Parameter] Shorthand for sortBy.",
        default: "id",
        param: {
            name: "sb",
            in: "query"
        }
    })
);

export const ZodSortByWithScoreQueryParamSchema = swaggerRegistry.registerParameter(
    "sortByWithScore",
    ZodSpaceQueryPropWithScoreSchema
        .optional()
        .openapi({
            description: "[Query Parameter] The field to sort by. 'id' if not provided.",
            default: "score",
            param: {
                name: "sortBy",
                in: "query"
            }
        })
);

export const ZodSortByWithScoreShorthandQueryParamSchema = swaggerRegistry.registerParameter(
    "sbWithScore",
    ZodSortByWithScoreQueryParamSchema
    .openapi({
        description: "[Query Parameter] Shorthand for sortBy.",
        default: "score",
        param: {
            name: "sb",
            in: "query"
        }
    })
);