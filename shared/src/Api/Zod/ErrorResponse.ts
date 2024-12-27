import { swaggerRegistry } from "src/Swagger";
import { z } from "zod";
import { ZodErrorCodeSchema } from "./ErrorCode";
import { ZodErrorMessageSchema } from "./ErrorMessage";

export const ZodErrorResponseBaseSchema = swaggerRegistry.register(
    "ErrorResponseBase",
    z.object({
        ok: z.literal(false).openapi({
            description: "Whether the operation was successful.",
            example: false
        }),
        help: z.string().url().optional().openapi({
            description: "A URL to the docs page that may help the user resolve the error.",
            example: "https://example.com/docs"
        })
    }).openapi({
        description: "An error response from the server."
    })
);

export const ZodErrorResponseSchema = swaggerRegistry.register(
    "ErrorResponse",
    ZodErrorResponseBaseSchema.merge(z.object({
        code: ZodErrorCodeSchema.openapi({
            description: "The error code.",
            example: "UNKNOWN"
        }),
        message: ZodErrorMessageSchema
    }).openapi({
        description: "An error response from the server."
    }))
);

export const ZodErrorResponse501Schema = swaggerRegistry.register(
    "ErrorResponse501",
    ZodErrorResponseBaseSchema.merge(z.object({
        code: ZodErrorCodeSchema.openapi({
            description: "The error code.",
            example: "NOT_IMPLEMENTED"
        }),
        message: ZodErrorMessageSchema.openapi({
            description: "A message describing an error.",
            example: "This feature is not yet implemented."
        })
    }).openapi({
        description: "A 501 error response from the server."
    }))
);

export const ZodErrorResponse400Schema = swaggerRegistry.register(
    "ErrorResponse400",
    ZodErrorResponseBaseSchema.merge(z.object({
        code: ZodErrorCodeSchema.openapi({
            description: "The error code.",
            example: "BAD_INPUT"
        }),
        message: ZodErrorMessageSchema.openapi({
            description: "A message describing an error.",
            example: "Invalid input."
        })
    }).openapi({
        description: "A 400 error response from the server."
    }))
);

export const ZodErrorResponse404Schema = swaggerRegistry.register(
    "ErrorResponse404",
    ZodErrorResponseBaseSchema.merge(z.object({
        code: ZodErrorCodeSchema.openapi({
            description: "The error code.",
            example: "NOT_FOUND"
        }),
        message: ZodErrorMessageSchema.openapi({
            description: "A message describing an error.",
            example: "No resources found."
        })
    }).openapi({
        description: "A 404 error response from the server."
    }))
);


export type ErrorResponseBase = z.infer<typeof ZodErrorResponseBaseSchema>;
export type ErrorResponse = z.infer<typeof ZodErrorResponseSchema>;
