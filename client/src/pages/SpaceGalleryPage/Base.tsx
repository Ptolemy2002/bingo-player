import { SuspenseBoundary } from "@ptolemy2002/react-suspense";
import DefaultSearchBar from "./SearchBarBase";
import { SpaceGalleryPageProps } from "./Types";

export default function SpaceGalleryPageBase({
    className,
    SearchBar=DefaultSearchBar
}: SpaceGalleryPageProps["functional"]) {
    return (
        <div id="space-gallery-page" className={className}>
            <h1>Space Gallery</h1>
            <SuspenseBoundary fallback={<p>Loading...</p>}>
                <SearchBar />
            </SuspenseBoundary>
        </div>
    );
}