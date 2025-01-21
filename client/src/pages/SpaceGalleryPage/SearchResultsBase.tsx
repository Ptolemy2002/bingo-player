import { SpaceGallerySearchResultsProps } from "./Types";
import useSpaceGallerySearchParamState from "./SearchParams";
import { ReactNode } from "react";
import clsx from "clsx";

export default function SpaceSearchResultsBase({
    className,
}: SpaceGallerySearchResultsProps["functional"]) {
    const { q } = useSpaceGallerySearchParamState();

    let element: ReactNode;

    if (q.length === 0) {
        element = <p className={clsx("space-gallery-search-results", "empty-query", className)}>
            Enter a search term to see results
        </p>;
    } else {
        element = <p className={clsx("space-gallery-search-results", className)}>
            To be implemented...
        </p>;
    }

    return element;
}
