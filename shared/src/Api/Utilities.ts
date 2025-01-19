import { SortOrder } from "./Zod/SortOrder";

export function interpretSortOrder(sortOrder: SortOrder): 1 | -1 | "random" {
    switch (sortOrder) {
        case "asc":
        case "ascending":
        case "1":
            return 1;
        case "desc":
        case "descending":
        case "-1":
            return -1;
        case "random":
        case "rand":
            return "random";
    }
}