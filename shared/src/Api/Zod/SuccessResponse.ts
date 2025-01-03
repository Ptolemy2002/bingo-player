import { swaggerRegistry } from "src/Swagger";
import { z } from "zod";
import { ZodHelpLinkSchema } from "./HelpLink";

export const ZodSuccessResponseBaseSchema = swaggerRegistry.register(
    "SuccessResponseBase",
    z.object({
        ok: z.literal(true).openapi({
            description: "Whether the operation was successful.",
            example: true
        }),
        help: ZodHelpLinkSchema
    }).openapi({
        description: "A successful response from the server."
    })
);

export function zodSuccessResponseSchema<T>(dataSchema: z.ZodType<T>) {
    return z.intersection(
        dataSchema,
        ZodSuccessResponseBaseSchema
    );
}

export type SuccessResponseBase = z.infer<typeof ZodSuccessResponseBaseSchema>;