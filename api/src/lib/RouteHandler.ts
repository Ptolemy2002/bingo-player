import getEnv, { EnvType } from 'env';
import { ErrorCode, ErrorResponse, ErrorResponse400, ErrorResponse404, ErrorResponse501, ErrorResponseWithCode, SuccessResponseBase } from 'shared';
import { ZodError } from 'zod';
import { interpretZodError } from '@ptolemy2002/regex-utils';
import { Response } from 'express';

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
    protected _docsEndpoint: string;
    protected _docsVersion: number;
    protected _env: EnvType;
    protected help: string;

    set env(value: EnvType) {
        this._env = value;
        this.recalculateHelp();
    }

    get env() {
        return this._env;
    }

    set docsVersion(value: number) {
        this._docsVersion = value;
        this.recalculateHelp();
    }

    get docsVersion() {
        return this._docsVersion;
    }

    set docsEndpoint(value: string) {
        this._docsEndpoint = value;
        this.recalculateHelp();
    }

    get docsEndpoint() {
        return this._docsEndpoint;
    }

    constructor(docsVersion: number, docsEndpoint: string) {
        this._env = getEnv();
        this._docsVersion = docsVersion;
        this._docsEndpoint = docsEndpoint;
        this.help = this.recalculateHelp();
    }

    protected recalculateHelp() {
        this.help = this.env.getDocsURL(this.docsVersion) + this._docsEndpoint;
        return this.help;
    }

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
    ): ErrorResponse400 {
        return this.buildErrorResponse(
            code,
            interpretZodError(error)
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

    async generateResponse(
        req: RouteHandlerRequestData,
        res: RouteHandlerResponseData
    ): Promise<GeneratedResonse<SuccessResponse>> {
        return {
            status: 501,
            response: this.buildNotImplementedResponse()
        };
    }

    async handle(req: RouteHandlerRequestData, res: Response) {
        const { status, response } = await this.generateResponse(req, res);
        res.status(status).json(response);
    }
}