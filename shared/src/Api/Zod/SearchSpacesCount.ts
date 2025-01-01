import { swaggerRegistry } from "src/Swagger";
import { ZodSearchSpacesParamsSchema } from "./SearchSpaces";
import { ZodCountSpaces200ResponseBodySchema } from "./CountSpaces";
import { ZodErrorResponseSchema } from "./ErrorResponse";
import { z } from "zod";

export const ZodSearchSpacesCountParamsSchema = swaggerRegistry.register(
    "SearchSpacesCountParams",
    ZodSearchSpacesParamsSchema
);

export const ZodSearchSpacesCount200ResponseBodySchema = swaggerRegistry.register(
    "SearchSpacesCount200ResponseBody",
    ZodCountSpaces200ResponseBodySchema
);

export const ZodSearchSpacesCountResponseBodySchema = swaggerRegistry.register(
    "SearchSpacesCountResponseBody",
    z.union([
        ZodSearchSpacesCount200ResponseBodySchema,
        ZodErrorResponseSchema
    ])
);

export type SearchSpacesCountParams = z.input<typeof ZodSearchSpacesCountParamsSchema>;

export type SearchSpacesCount200ResponseBody = z.infer<typeof ZodSearchSpacesCount200ResponseBodySchema>;
export type SearchSpacesCountResponseBody = z.infer<typeof ZodSearchSpacesCountResponseBodySchema>;