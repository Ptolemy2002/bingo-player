import { swaggerRegistry } from "src/Swagger";
import { z } from "zod";
import { SortOrderEnum } from "../Other";

export const ZodSortOrderSchema = swaggerRegistry.register(
    "SortOrder",
    z.union([
        z.literal(1),
        z.literal(-1),
        z.enum(SortOrderEnum)
    ]).openapi({
        description: "The order to sort by.",
        example: "asc"
    })
);

export type SortOrder = z.infer<typeof ZodSortOrderSchema>;