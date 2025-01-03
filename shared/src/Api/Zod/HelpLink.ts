import { swaggerRegistry } from "src/Swagger";
import { z } from "zod";

export const ZodHelpLinkSchema = swaggerRegistry.register(
    "HelpLink",
    z.string().url().optional().openapi({
        description: "A URL to the docs page that may help the user resolve the error or understand the response.",
        example: "https://example.com/docs"
    })
);

export type HelpLink = z.infer<typeof ZodHelpLinkSchema>;
