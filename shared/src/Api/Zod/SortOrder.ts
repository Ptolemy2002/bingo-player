import { swaggerRegistry } from "src/Swagger";
import { z } from "zod";
import { SortOrderEnum } from "../Other";

export const ZodSortOrderSchema = swaggerRegistry.register(
    "SortOrder",
    z.enum(SortOrderEnum).openapi({
        description: "The order to sort by.",
        example: "asc"
    })
);

export type SortOrder = z.infer<typeof ZodSortOrderSchema>;