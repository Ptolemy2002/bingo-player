import { z } from "zod";
import { swaggerRegistry } from "src/Swagger";
import { ZodCoercedBoolean } from "@ptolemy2002/regex-utils";
import { ZodSortOrderSchema } from "./SortOrder";
import { ZodSpaceQueryPropSchema } from "src/Space";

export const ZodLimitQueryParamSchema = swaggerRegistry.registerParameter(
    "limit",
    z.coerce.number().int()
        .min(1, "limit must be non-negative and non-zero")
        .optional()
        .openapi({
            description: "[Query Parameter] The maximum number of spaces to return. Must be a positive integer and non-zero.",
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
            description: "[Query Parameter] The number of spaces to skip before returning results. Must be a non-negative integer.",
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
            description: "[Query Parameter] The order to sort the field by. Defaults to ascending.",
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

export const ZodSortByQueryParamSchema = swaggerRegistry.registerParameter(
    "sortBy",
    ZodSpaceQueryPropSchema
        .optional()
        .openapi({
            description: "[Query Parameter] The field to sort by. Defaults to id.",
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
        param: {
            name: "sb",
            in: "query"
        }
    })
);