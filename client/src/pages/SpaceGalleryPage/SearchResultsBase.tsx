import { SpaceGallerySearchResultsProps } from "./Types";
import useSpaceGallerySearchParamState from "./SearchParams";
import { ReactNode } from "react";
import clsx from "clsx";
import { useSpaceGallerySearchContext } from "./Context";

export default function SpaceSearchResultsBase({
    className,
}: SpaceGallerySearchResultsProps["functional"]) {
    const { q } = useSpaceGallerySearchParamState();
    const [search] = useSpaceGallerySearchContext(["hasPressed", "results"]);

    let element: ReactNode;
    if (q.length === 0) {
        element = <p className={clsx("space-gallery-search-results", "empty-query", className)}>
            Enter a search term to see results
        </p>;
    } else if (!search.hasPressed) {
        element = <p className={clsx("space-gallery-search-results", "unpressed", className)}>
            Press the search button to perform a search
        </p>;
    } else if (search.results.length === 0) {
        element = <p className={clsx("space-gallery-search-results", "no-results", className)}>
            No results found
        </p>;
    } else {
        element = <p className={clsx("space-gallery-search-results", className)}>
            To be implemented...
        </p>;
    }

    return element;
}
