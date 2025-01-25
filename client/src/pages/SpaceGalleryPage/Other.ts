export function calcPagination(
    p: number,
    ps: number,
    totalCount: number
) {
    const totalPages = Math.ceil(totalCount / ps);
    if (p > totalPages) {
        p = totalPages;
    }

    const offset = Math.max((p - 1) * ps, 0);
    const limit = Math.min(ps, totalCount - offset);
    return {
        offset,
        limit,
        currentPage: p,
        totalPages,
        first: offset + 1,
        last: offset + limit,
        totalCount
    };
}