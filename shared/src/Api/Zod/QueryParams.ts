import { z } from "zod";
import { swaggerRegistry } from "src/Swagger";
import { ZodCoercedBoolean } from "@ptolemy2002/regex-utils";

export const LimitQueryParamSchema = swaggerRegistry.registerParameter(
    "limit",
    z.coerce.number().int()
        .min(1, "limit must be non-negative and non-zero")
        .optional()
        .openapi({
            description: "[Query Parameter] The maximum number of spaces to return. Must be a positive integer and non-zero.",
            example: 10,
            param: {
                in: "query"
            }
        })
);

export const LimitShorthandQueryParamSchema = swaggerRegistry.registerParameter(
    "l",
    LimitQueryParamSchema.openapi({
        description: "[Query Parameter] Shorthand for limit.",
        example: 10,
        param: {
            in: "query"
        }
    })
);

export const OffsetQueryParamSchema = swaggerRegistry.registerParameter(
    "offset",
    z.coerce.number().int()
        .positive()
        .optional()
        .openapi({
            description: "[Query Parameter] The number of spaces to skip before returning results. Must be a non-negative integer.",
            default: 0,
            param: {
                in: "query"
            }
        })
);

export const OffsetShorthandQueryParamSchema = swaggerRegistry.registerParameter(
    "o",
    OffsetQueryParamSchema.openapi({
        description: "[Query Parameter] Shorthand for offset.",
        default: 0,
        param: {
            in: "query"
        }
    })
);

export const CaseSensitiveQueryParamSchema = swaggerRegistry.registerParameter(
    "caseSensitive",
    ZodCoercedBoolean
        .optional()
        .openapi({
            description: "[Query Parameter] Whether to match the query case-sensitively. False if not provided.",
            default: "f",
            param: {
                in: "query"
            }
        })
);

export const CaseSensitiveShorthandQueryParamSchema = swaggerRegistry.registerParameter(
    "cs",
    CaseSensitiveQueryParamSchema.openapi({
        description: "[Query Parameter] Shorthand for caseSensitive.",
        default: "f",
        param: {
            in: "query"
        }
    })
);

export const AccentSensitiveQueryParamSchema = swaggerRegistry.registerParameter(
    "accentSensitive",
    ZodCoercedBoolean
        .optional()
        .openapi({
            description: "[Query Parameter] Whether to match the query accent-sensitively. False if not provided.",
            default: "f",
            param: {
                in: "query"
            }
        })
);

export const AccentSensitiveShorthandQueryParamSchema = swaggerRegistry.registerParameter(
    "as",
    AccentSensitiveQueryParamSchema.openapi({
        description: "[Query Parameter] Shorthand for accentSensitive.",
        default: "f",
        param: {
            in: "query"
        }
    })
);

export const MatchWholeQueryParamSchema = swaggerRegistry.registerParameter(
    "matchWhole",
    ZodCoercedBoolean
        .optional()
        .openapi({
            description: "[Query Parameter] Whether to match the query as the whole string. False if not provided.",
            default: "f",
            param: {
                in: "query"
            }
        })
);

export const MatchWholeShorthandQueryParamSchema = swaggerRegistry.registerParameter(
    "mw",
    MatchWholeQueryParamSchema.openapi({
        description: "[Query Parameter] Shorthand for matchWhole.",
        default: "f",
        param: {
            in: "query"
        }
    })
);