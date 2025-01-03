import { SortOrder } from "./Zod/SortOrder";

export function interpretSortOrder(sortOrder: SortOrder): 1 | -1 | "random" {
    switch (sortOrder) {
        case "asc":
        case "ascending":
            return 1;
        case "desc":
        case "descending":
            return -1;
        case "random":
        case "rand":
            return "random";
    }
}