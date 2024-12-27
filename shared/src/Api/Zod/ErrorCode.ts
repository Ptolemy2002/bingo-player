import { swaggerRegistry } from "src/Swagger";
import { z } from "zod";
import { ErrorCodeEnum } from "src/Api/Other";

export const ZodErrorCodeSchema = swaggerRegistry.register(
    "ErrorCode",
    z.enum(ErrorCodeEnum).openapi({
        description: "An error code that may be returned by the server."
    })
);

export type ErrorCode = z.infer<typeof ZodErrorCodeSchema>;
