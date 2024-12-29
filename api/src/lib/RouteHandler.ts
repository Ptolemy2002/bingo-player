import getEnv, { EnvType } from 'env';
import { ErrorCode, ErrorResponse, ErrorResponse400, SuccessResponseBase } from 'shared';
import { ZodError } from 'zod';
import { interpretZodError } from '@ptolemy2002/regex-utils';
import { PartialBy } from '@ptolemy2002/ts-utils';

export default class RouteHandler {
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

    protected buildSuccessResponse<T extends SuccessResponseBase>(data: Omit<T, "ok" | "help">): T {
        return {
            ...data,
            ok: true,
            help: this.help
        } as T;
    }

    protected buildErrorResponse(
        code: ErrorCode = "UNKNOWN",
        message: ErrorResponse["message"] = "Internal server error."
    ): ErrorResponse {
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
    ) {
        return this.buildErrorResponse(
            code,
            interpretZodError(error)
        );
    }

    protected buildNotFoundResponse(
        message: string = 'No resources found.'
    ) {
        return this.buildErrorResponse('NOT_FOUND', message);
    }

    protected buildNotImplementedResponse(
        message: string = 'This feature is not yet implemented.'
    ) {
        return this.buildErrorResponse('NOT_IMPLEMENTED', message);
    }
}
