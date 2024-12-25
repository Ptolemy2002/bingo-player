import { ValueOf } from "@ptolemy2002/ts-utils";
import { ErrorCodeEnum } from "./Other";
import { CleanMongoSpace, SpaceQueryPropNonId } from "../Space";

export type ErrorCode = Extract<ValueOf<typeof ErrorCodeEnum>, string>;
export type ErrorResponse = {ok: false, code: ErrorCode, message: string | string[] | null, help?: string};
export type SuccessResponse<T={}> = T & {ok: true, help?: string};

export type GetSpacesResponseBody = SuccessResponse<{spaces: CleanMongoSpace[]}> | ErrorResponse;

export type GetSpacesByPropParams = {prop: SpaceQueryPropNonId, query: string};
export type GetSpacesByPropResponseBody = GetSpacesResponseBody; // unchanged for now, but could be different in the future

export type CountSpacesResponseBody = SuccessResponse<{count: number}> | ErrorResponse;

export type ListPropResponseBody = SuccessResponse<{values: (string | null)[]}> | ErrorResponse;