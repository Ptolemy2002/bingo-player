import { SpaceGallerySearchResultsProps } from "./Types";
import { ReactNode } from "react";
import clsx from "clsx";
import { useSpaceGallerySearchContext } from "./Context";
import useSpaceGallerySearchParamState from "./SearchParams";
import { calcPagination } from "./Other";
import SpaceData from "src/data/SpaceData";
import DefaultSpaceCard from "src/components/SpaceCard";
import { Col, Row } from "react-bootstrap";

export default function SpaceSearchResultsBase({
    className,
    cardsPerRowXs=12,
    cardsPerRowSm=12,
    cardsPerRowMd=6,
    cardsPerRowLg=4,
    cardsPerRowXl=3,
    SpaceCard=DefaultSpaceCard
}: SpaceGallerySearchResultsProps["functional"]) {
    const {
        p, ps
    } = useSpaceGallerySearchParamState();
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

            <div className="card-container">
                <Row>
                    {search.results.map((space) => (
                        // Apply generic "col" class for CSS selection purposes
                        <Col
                            key={space._id}
                            className="col"
                            xs={cardsPerRowXs}
                            sm={cardsPerRowSm}
                            md={cardsPerRowMd}
                            lg={cardsPerRowLg}
                            xl={cardsPerRowXl}
                        >
                            <SpaceData.Provider value={space}>
                                <SpaceCard />
                            </SpaceData.Provider>
                        </Col>
                    ))}
                </Row>
            </div>
        </div>;
    }

    return element;
}
