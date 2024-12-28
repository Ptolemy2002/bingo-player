import { swaggerRegistry } from "src/Swagger";
import { ZodGetSpacesByPropParamsSchema, ZodGetSpacesByPropQueryParamsSchema } from "./GetSpacesByProp";
import { ZodCountSpacesResponseBodySchema, ZodCountSpaces200ResponseBodySchema } from "./CountSpaces";
import { z } from "zod";

// For now, counting is a very similar operation to getting, so we can reuse schemas.
export const ZodCountSpacesByProp200ResponseBodySchema = swaggerRegistry.register("CountSpacesByProp200ResponseBody", ZodCountSpaces200ResponseBodySchema);
export const ZodCountSpacesByPropResponseBodySchema = swaggerRegistry.register("CountSpacesByPropResponseBody", ZodCountSpacesResponseBodySchema);
export const ZodCountSpacesByPropParamsSchema = swaggerRegistry.register("CountSpacesByPropParams", ZodGetSpacesByPropParamsSchema);
export const ZodCountSpacesByPropQueryParamsSchema = swaggerRegistry.register("CountSpacesByPropQueryParams", ZodGetSpacesByPropQueryParamsSchema);

export type CountSpacesByPropParams = z.infer<typeof ZodCountSpacesByPropParamsSchema>;
export type CountSpacesByProp200ResponseBody = z.infer<typeof ZodCountSpacesByProp200ResponseBodySchema>;
export type CountSpacesByPropResponseBody = z.infer<typeof ZodCountSpacesByPropResponseBodySchema>;
export type CountSpacesByPropQueryParamsInput = z.input<typeof ZodCountSpacesByPropQueryParamsSchema>;
export type CountSpacesByPropQueryParamsOutput = z.infer<typeof ZodCountSpacesByPropQueryParamsSchema>;