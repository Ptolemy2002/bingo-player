import { ErrorCode, HelpLink } from "shared";

export default class RouteError extends Error {
    status: number = 500;
    code: ErrorCode = "UNKNOWN";
    help: HelpLink = "https://example.com/docs";

    constructor(
        message: string, status: number = 500, code: ErrorCode = "UNKNOWN", help: HelpLink = "https://example.com/docs"
    ) {
        super(message);
        this.status = status;
        this.code = code;
        this.help = help;
    }
}