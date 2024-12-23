import { z } from "zod";
import {CleanMongoSpace, ZodSpaceQueryPropSchema} from "./Space";

export type ErrorCode = "UNKNOWN" | "BAD_INPUT" | "INTERNAL" | "NOT_FOUND" | "NOT_IMPLEMENTED";
export const SwaggerErrorCodeSchema = {
    "@enum": [
        "UNKNOWN",
        "BAD_INPUT",
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
export type CountSpacesResponseBody = SuccessResponse<{count: number}> | ErrorResponse;
export type ListPropResponseBody = SuccessResponse<{values: (string | null)[]}> | ErrorResponse;

export const ZodListPropParamsSchema = z.object({
    prop: ZodSpaceQueryPropSchema
});
export const ZodListPropParamsShape = ZodListPropParamsSchema.shape;
export type ListPropParams = z.input<typeof ZodListPropParamsSchema>;