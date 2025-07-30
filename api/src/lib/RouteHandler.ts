import { ErrorCode, ErrorResponse, ErrorResponse400, ErrorResponse404, ErrorResponse501, ErrorResponseWithCode, SuccessResponseBase } from 'shared';
import { ZodError } from 'zod';
import { interpretZodError, InterpretZodErrorOptions } from '@ptolemy2002/regex-utils';

export type GeneratedResonse<SuccessResponse extends SuccessResponseBase> = {
    status: number;
    response: ErrorResponse | SuccessResponse;
};

export type RouteHandlerRequestData = {
    params: unknown;
    query: unknown;
    body: unknown;
};

export type RouteHandlerResponseData = {
    locals: unknown;
};

export default class RouteHandler<SuccessResponse extends SuccessResponseBase> {
    protected help: string | undefined = undefined;

    protected buildSuccessResponse(data: Omit<SuccessResponse, "ok" | "help">): SuccessResponse {
        return {
            ...data,
            ok: true,
            help: this.help
        } as SuccessResponse;
    }

    protected buildErrorResponse<EC extends ErrorCode = "UNKNOWN">(
        code: EC,
        message: ErrorResponse["message"] = "Internal server error."
    ): ErrorResponseWithCode<EC> {
        return {
            ok: false,
            code,
            message,
            help: this.help,
        };
    }

    protected buildZodErrorResponse(
        error: ZodError,
        code: ErrorResponse400['code'] = 'BAD_INPUT',
        interpretOptions: InterpretZodErrorOptions = {},
    ): ErrorResponse400 {
        if (interpretOptions.prefix === undefined) {
            if (code === 'BAD_BODY') {
                interpretOptions.prefix = 'body';
            } else if (code === 'BAD_URL') {
                interpretOptions.prefix = 'url';
            } else if (code === 'BAD_QUERY') {
                interpretOptions.prefix = 'query';
            }
        }

        return this.buildErrorResponse(
            code,
            interpretZodError(error, interpretOptions)
        );
    }

    protected buildNotFoundResponse(
        message: ErrorResponse["message"] = 'No resources found.'
    ): ErrorResponse404 {
        return this.buildErrorResponse('NOT_FOUND', message);
    }

    protected buildNotImplementedResponse(
        message: ErrorResponse["message"] = 'This feature is not yet implemented.'
    ): ErrorResponse501 {
        return this.buildErrorResponse('NOT_IMPLEMENTED', message);
    }

    protected buildLocalsErrorResponse(
        message: ErrorResponse["message"] = 'Did not receive expected data from previous middleware in res.locals.'
    ): ErrorResponse {
        return this.buildErrorResponse('INTERNAL', message);
    }
}