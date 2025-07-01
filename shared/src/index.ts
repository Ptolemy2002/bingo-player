import { OpenApiGeneratorV31 } from "@asteasolutions/zod-to-openapi";
import { swaggerRegistry } from "src/Swagger";

export * from "./Swagger";
export * from "./Utilities";
export * from "./Space";
export * from "./Api";
export * from "./Socket";

export const swaggerGenerator = new OpenApiGeneratorV31(swaggerRegistry.definitions);