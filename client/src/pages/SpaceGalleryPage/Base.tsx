import { SuspenseBoundary } from "@ptolemy2002/react-suspense";
import DefaultSearchBar from "./SearchBarStyled";
import DefaultSearchResults from "./SearchResultsStyled";
import { SpaceGalleryPageProps } from "./Types";
import useSpaceGallerySearchParamState from "./SearchParams";
import { SpaceGallerySearchProvider } from "./Context";
import { ErrorBoundary } from "react-error-boundary";
import DefaultErrorAlert from "src/components/alerts/ErrorAlert";
import { Alert } from "react-bootstrap";
import DefaultLoadingAlert from "src/components/alerts/LoadingAlert";
import SpaceData from "src/data/SpaceData";
import { useMountEffect } from "@ptolemy2002/react-mount-effects";

export default function SpaceGalleryPageBase({
    className,
    SearchBar=DefaultSearchBar,
    SearchResults=DefaultSearchResults,
    ErrorAlert=DefaultErrorAlert,
    LoadingAlert=DefaultLoadingAlert
}: SpaceGalleryPageProps["functional"]) {
    const [, setSpace] = SpaceData.useContext();
    const { q, setQ } = useSpaceGallerySearchParamState();

    useMountEffect(() => {
        // Remove the current space being edited
        setSpace(null);
    });

    return (
        <div id="space-gallery-page" className={className}>
            <h1>Space Gallery</h1>
            <ErrorBoundary fallbackRender={
                    ({ resetErrorBoundary, ...props}) =>
                    <ErrorAlert {...props}>
                        {{
                            head: "Error",
                            body: <>
                                An error occurred while searching for spaces. Details in the console.
                                <br />
                                <Alert.Link onClick={() => {
                                    setQ("");
                                    // Give the search param state a chance to update before resetting the error boundary
                                    setTimeout(resetErrorBoundary, 0);
                                }}>
                                    Click here to try again
                                </Alert.Link>
                            </>
                        }}
                    </ErrorAlert>
            }>
                <SpaceGallerySearchProvider value={{ hasPressed: false, results: [], totalCount: 0 }}>
                    <SuspenseBoundary
                        fallback={
                            <LoadingAlert>
                                {{
                                    head: "Loading...",
                                    body: "Getting spaces. Please wait."
                                }}
                            </LoadingAlert>
                        }
                        renderDeps={[q]}
                    >
                        <SearchBar />
                        <SearchResults />
                    </SuspenseBoundary>
                </SpaceGallerySearchProvider>
            </ErrorBoundary>
        </div>
    );
}