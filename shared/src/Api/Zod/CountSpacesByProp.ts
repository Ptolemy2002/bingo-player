import { swaggerRegistry } from "../../Swagger";
import { ZodGetSpacesByPropParamsSchema, ZodGetSpacesByPropQueryParamsSchema } from "./GetSpacesByProp";
import { ZodCountSpacesResponseBody, ZodCountSpaces200ResponseBody } from "./CountSpaces";
import { z } from "zod";

// For now, counting is a very similar operation to getting, so we can reuse schemas.
export const ZodCountSpacesByProp200ResponseBody = swaggerRegistry.register("CountSpacesByProp200ResponseBody", ZodCountSpaces200ResponseBody);
export const ZodCountSpacesByPropResponseBodySchema = swaggerRegistry.register("CountSpacesByPropResponseBody", ZodCountSpacesResponseBody);
export const ZodCountSpacesByPropParamsSchema = swaggerRegistry.register("CountSpacesByPropParams", ZodGetSpacesByPropParamsSchema);
export const ZodCountSpacesByPropQueryParamsSchema = swaggerRegistry.register("CountSpacesByPropQueryParams", ZodGetSpacesByPropQueryParamsSchema);

export type CountSpacesByPropParams = z.infer<typeof ZodCountSpacesByPropParamsSchema>;
export type CountSpacesByProp200ResponseBody = z.infer<typeof ZodCountSpacesByProp200ResponseBody>;
export type CountSpacesByPropResponseBody = z.infer<typeof ZodCountSpacesByPropResponseBodySchema>;
export type CountSpacesByPropQueryParamsInput = z.input<typeof ZodCountSpacesByPropQueryParamsSchema>;
export type CountSpacesByPropQueryParamsOutput = z.infer<typeof ZodCountSpacesByPropQueryParamsSchema>;