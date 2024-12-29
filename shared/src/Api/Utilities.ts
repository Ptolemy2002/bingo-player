import { SortOrder } from "./Zod/SortOrder";

export function interpretSortOrder(sortOrder: SortOrder): 1 | -1 {
    if (typeof sortOrder === "number") return sortOrder;
    
    switch (sortOrder) {
        case "asc":
        case "ascending":
            return 1;
        case "desc":
        case "descending":
            return -1;
    }
}