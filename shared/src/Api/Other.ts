export const ErrorCodeEnum = [
    "UNKNOWN",
    "BAD_INPUT",
    "BAD_URL",
    "BAD_QUERY",
    "BAD_BODY",
    "INTERNAL",
    "NOT_FOUND",
    "NOT_IMPLEMENTED"
] as const;

export const SortOrderEnum = [
    "asc",
    "ascending",
    "desc",
    "descending"
] as const;