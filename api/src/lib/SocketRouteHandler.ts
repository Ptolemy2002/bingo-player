import { ErrorResponse, SuccessResponseBase, ZodErrorCodeSchema, ZodErrorMessageSchema } from "shared";
import RouteHandler, { GeneratedResonse } from "./RouteHandler";
import getEnv, { EnvType } from "env";
import { TypedSocket, TypedSocketServer } from "services/socket";
import isCallable from "is-callable";

export type SocketRouteHandlerRequestData = {
    socket: TypedSocket;
    io: TypedSocketServer;
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

    async handle(socket: TypedSocket, io: TypedSocketServer, args: unknown, callback: (res: SuccessResponse | ErrorResponse) => void): Promise<void> {
        try {
            const { status, response } = await this.generateResponse({ socket, io, id: socket.id, args });
            if (isCallable(callback)) callback(response);
            console.log("Socket route", `[${this.docsEndpoint}]`, "handled request from", `[${socket.id}]`, "with args", JSON.stringify(args ?? {}), "and status", status);
        } catch (err: any) {
            console.log("Socket route", `[${this.docsEndpoint}]`, "with args", JSON.stringify(args ?? {}), "caught error:");
            console.error(err.stack);

            let code = err.code ?? "UNKNOWN";
            const { success: codeSuccess } = ZodErrorCodeSchema.safeParse(code);

            let message = err.message ?? "Unknown error";
            const { success: messageSuccess } = ZodErrorMessageSchema.safeParse(message);

            if (!codeSuccess) {
                code = "UNKNOWN";
            }

            if (!messageSuccess) {
                message = "Unknown error";
            }
            
            if (isCallable(callback)) callback(this.buildErrorResponse(code, message));
        }
    }
}