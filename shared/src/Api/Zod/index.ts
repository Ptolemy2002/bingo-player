import { z } from "zod";
import { ZodMongoSpaceSchema, ZodSpaceQueryPropNonIdSchema, ZodSpaceQueryPropSchema } from "../../Space";
import { ZodCoercedBoolean } from "@ptolemy2002/regex-utils";
import { swaggerRegistry } from "../../Swagger";

export * from "./ErrorCode";
export * from "./ErrorResponse";
export * from "./SuccessResponse";

export * from "./GetSpaces";
export * from "./GetSpacesByProp";

export * from "./CountSpaces";
export * from "./CountSpacesByProp";

export * from "./ListProp";