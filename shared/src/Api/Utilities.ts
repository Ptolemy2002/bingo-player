import { SortOrder } from "./Zod/SortOrder";

export function interpretSortOrder(sortOrder: SortOrder): "asc" | "desc" {
    switch (sortOrder) {
        case "asc":
        case "ascending":
            return "asc";
        case "desc":
        case "descending":
            return "desc";
    }
}