import { SuspenseBoundary } from "@ptolemy2002/react-suspense";
import DefaultSearchBar from "./SearchBarStyled";
import DefaultSearchResults from "./SearchResultsStyled";
import { SpaceGalleryPageProps } from "./Types";
import useSpaceGallerySearchParamState from "./SearchParams";

export default function SpaceGalleryPageBase({
    className,
    SearchBar=DefaultSearchBar,
    SearchResults=DefaultSearchResults,
}: SpaceGalleryPageProps["functional"]) {
    const { q } = useSpaceGallerySearchParamState();

    return (
        <div id="space-gallery-page" className={className}>
            <h1>Space Gallery</h1> 
            <SuspenseBoundary fallback={<p>Loading...</p>} renderDeps={[q]}>
                <SearchBar />
                <SearchResults />
            </SuspenseBoundary>
        </div>
    );
}