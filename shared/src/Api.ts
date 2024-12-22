import {CleanMongoSpace} from "./Space";

export type ErrorCode = "UNKNOWN" | "BAD_INPUT" | "INTERNAL" | "NOT_FOUND" | "NOT_IMPLEMENTED";
export type ErrorResponse = {ok: false, code: ErrorCode, message: string, help?: string};

export type SuccessResponse<T={}> = T & {ok: true, help?: string};

export type GetAllSpacesResponseBody = SuccessResponse<{spaces: CleanMongoSpace[]}> | ErrorResponse;