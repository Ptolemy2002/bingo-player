import { z } from "zod";
import {CleanMongoSpace, ZodSpaceQueryPropSchema} from "./Space";

export type ErrorCode = "UNKNOWN" | "BAD_INPUT" | "INTERNAL" | "NOT_FOUND" | "NOT_IMPLEMENTED";
export type ErrorResponse = {ok: false, code: ErrorCode, message: string | string[] | null, help?: string};

export type SuccessResponse<T={}> = T & {ok: true, help?: string};

export type GetSpacesResponseBody = SuccessResponse<{spaces: CleanMongoSpace[]}> | ErrorResponse;
export type CountSpacesResponseBody = SuccessResponse<{count: number}> | ErrorResponse;
export type ListPropResponseBody = SuccessResponse<{values: string[]}> | ErrorResponse;

export const ZodListPropParamsSchema = z.object({
    prop: ZodSpaceQueryPropSchema
});
export const ZodListPropParamsShape = ZodListPropParamsSchema.shape;
export type ListPropParams = z.input<typeof ZodListPropParamsSchema>;