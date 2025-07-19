import { ErrorResponse, SuccessResponseBase } from "shared";
import RouteHandler, { GeneratedResonse } from "./RouteHandler";
import getEnv, { EnvType } from "env";
import { Socket } from "socket.io";

export type SocketRouteHandlerRequestData = {
    id: string;
    args: unknown;
};

export default class SocketRouteHandler<SuccessResponse extends SuccessResponseBase> extends RouteHandler<SuccessResponse> {
    protected _env: EnvType;
    protected _docsEndpoint: string;

    set env(value: EnvType) {
        this._env = value;
        this.recalculateHelp();
    }

    get env() {
        return this._env;
    }

    set docsEndpoint(value: string) {
        this._docsEndpoint = value;
        this.recalculateHelp();
    }

    get docsEndpoint() {
        return this._docsEndpoint;
    }

    constructor(docsEndpoint: string) {
        super();
        this._docsEndpoint = docsEndpoint;
        this._env = getEnv();
        this.help = this.recalculateHelp();
    }

    protected recalculateHelp() {
        this.help = this.env.socketDocsURL + "#" + this._docsEndpoint;
        return this.help;
    }

    async generateResponse(
        req: SocketRouteHandlerRequestData,
    ): Promise<GeneratedResonse<SuccessResponse>> {
        return {
            status: 501,
            response: this.buildNotImplementedResponse()
        };
    }

    async handle(socket: Socket, args: unknown, callback: (res: SuccessResponse | ErrorResponse) => void): Promise<void> {
        const { response } = await this.generateResponse({ id: socket.id, args });
        callback(response);
    }
}