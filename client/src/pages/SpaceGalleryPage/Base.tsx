import { SuspenseBoundary } from "@ptolemy2002/react-suspense";
import DefaultSearchBar from "./SearchBarStyled";
import DefaultSearchResults from "./SearchResultsStyled";
import { SpaceGalleryPageProps } from "./Types";
import useSpaceGallerySearchParamState from "./SearchParams";
import { SpaceGallerySearchProvider } from "./Context";

export default function SpaceGalleryPageBase({
    className,
    SearchBar=DefaultSearchBar,
    SearchResults=DefaultSearchResults,
}: SpaceGalleryPageProps["functional"]) {
    const { q } = useSpaceGallerySearchParamState();

    return (
        <div id="space-gallery-page" className={className}>
            <h1>Space Gallery</h1>
            <SpaceGallerySearchProvider value={{ hasPressed: false, results: [], totalCount: 0 }}>
                <SuspenseBoundary fallback={<p>Loading...</p>} renderDeps={[q]}>
                    <SearchBar />
                    <SearchResults />
                </SuspenseBoundary>
            </SpaceGallerySearchProvider>
        </div>
    );
}