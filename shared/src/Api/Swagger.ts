import { ErrorCodeEnum } from "./Other";

export const SwaggerErrorCodeSchema = {
    "@enum": ErrorCodeEnum
} as const;

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
            enum: ErrorCodeEnum
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
} as const;
