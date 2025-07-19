import { SuccessResponseBase } from "shared";
import RouteHandler, { GeneratedResonse } from "./RouteHandler";
import { Response } from "express";
import getEnv, { EnvType } from "env";

export type ExpressRouteHandlerRequestData = {
    params: unknown;
    query: unknown;
    body: unknown;
};

export type ExpressRouteHandlerResponseData = {
    locals: unknown;
};

export default class ExpressRouteHandler<SuccessResponse extends SuccessResponseBase> extends RouteHandler<SuccessResponse> {
    protected _env: EnvType;
    protected _docsEndpoint: string;
    protected _docsVersion: number;

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
        super();
        this._docsVersion = docsVersion;
        this._docsEndpoint = docsEndpoint;
        this._env = getEnv();
        this.help = this.recalculateHelp();
    }

    protected recalculateHelp() {
        this.help = this.env.getExpressDocsURL(this.docsVersion) + this._docsEndpoint;
        return this.help;
    }

    async generateResponse(
        req: ExpressRouteHandlerRequestData,
        res: ExpressRouteHandlerResponseData
    ): Promise<GeneratedResonse<SuccessResponse>> {
        return {
            status: 501,
            response: this.buildNotImplementedResponse()
        };
    }

    async handle(req: ExpressRouteHandlerRequestData, res: Response) {
        const { status, response } = await this.generateResponse(req, res);
        res.status(status).json(response);
    }
}