import { SpaceGallerySearchResultsProps } from "./Types";
import { ReactNode } from "react";
import clsx from "clsx";
import { useSpaceGallerySearchContext } from "./Context";
import useSpaceGallerySearchParamState from "./SearchParams";
import { calcPagination } from "./Other";

export default function SpaceSearchResultsBase({
    className,
}: SpaceGallerySearchResultsProps["functional"]) {
    const { p, ps } = useSpaceGallerySearchParamState();
    const [search] = useSpaceGallerySearchContext(["hasPressed", "results"]);

    const {
        limit, currentPage, totalPages,
        totalCount,
        first, last
    } = calcPagination(p, ps, search.totalCount);

    let element: ReactNode;
    if (!search.hasPressed) {
        element = <p className={clsx("space-gallery-search-results", "unpressed", className)}>
            Press the search button to perform a search
        </p>;
    } else if (search.results.length === 0) {
        element = <p className={clsx("space-gallery-search-results", "no-results", className)}>
            No results found
        </p>;
    } else {
        element = <div className={clsx("space-gallery-search-results", className)}>
            <p>Found {totalCount} results. Showing page {currentPage} of {totalPages} ({first} - {last}) ({limit} items)</p>

            <ul>
                {search.results.map((space) => (
                    <li key={space._id}>
                        {space.name}
                    </li>
                ))}
            </ul>
        </div>;
    }

    return element;
}
