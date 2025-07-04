import { SuspenseBoundary } from "@ptolemy2002/react-suspense";
import DefaultSearchBar from "./SearchBarStyled";
import DefaultSearchResults from "./SearchResultsStyled";
import DefaultCreateButton from "./SpaceCreateButton";
import { SpaceGalleryPageProps } from "./Types";
import useSpaceGallerySearchParamState from "./SearchParams";
import { SpaceGallerySearchProvider } from "./Context";
import { ErrorBoundary } from "react-error-boundary";
import ErrorAlert from "src/components/alerts/ErrorAlert";
import { Alert } from "react-bootstrap";
import LoadingAlert from "src/components/alerts/LoadingAlert";

function SpaceGalleryPageBase({
    className,
    SearchBar=DefaultSearchBar,
    SearchResults=DefaultSearchResults,
    CreateButton=DefaultCreateButton
}: SpaceGalleryPageProps["functional"]) {
    const { q, setQ } = useSpaceGallerySearchParamState();

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
                        
                        <br />
                        <div className="btn-row">
                            <CreateButton />
                        </div>
                        <br />

                        <SearchResults />
                    </SuspenseBoundary>
                </SpaceGallerySearchProvider>
            </ErrorBoundary>
        </div>
    );
}

export function applySubComponents<
    T extends typeof SpaceGalleryPageBase
>(C: T) {
    return Object.assign(C, {
        SearchBar: DefaultSearchBar,
        SearchResults: DefaultSearchResults
    })
}

export default applySubComponents(SpaceGalleryPageBase);