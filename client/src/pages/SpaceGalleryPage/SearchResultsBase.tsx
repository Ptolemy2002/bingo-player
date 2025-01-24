import { SpaceGallerySearchResultsProps } from "./Types";
import { ReactNode } from "react";
import clsx from "clsx";
import { useSpaceGallerySearchContext } from "./Context";

export default function SpaceSearchResultsBase({
    className,
}: SpaceGallerySearchResultsProps["functional"]) {
    const [search] = useSpaceGallerySearchContext(["hasPressed", "results"]);

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
            <p>Found {search.results.length} results</p>
        </div>;
    }

    return element;
}
