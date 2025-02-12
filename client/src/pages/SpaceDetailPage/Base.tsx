import DefaultErrorAlert from 'src/components/alerts/ErrorAlert';
import DefaultLoadingAlert from 'src/components/alerts/LoadingAlert';
import { SpaceDetailPageProps } from './Types';
import { ErrorBoundary } from 'react-error-boundary';
import { Alert } from 'react-bootstrap';
import { SuspenseBoundary } from '@ptolemy2002/react-suspense';
import SpaceData from 'src/data/SpaceData';
import { useParams } from 'react-router';
import TagBadge from 'src/components/TagBadge';
import { listInPlainEnglish } from '@ptolemy2002/js-utils';
import { useMemo } from 'react';
import { MarkdownRenderer } from 'src/lib/Markdown';

export default function SpaceDetailPageBase({
    className,
    ErrorAlert=DefaultErrorAlert,
    LoadingAlert=DefaultLoadingAlert
}: SpaceDetailPageProps["functional"]) {
    const [space, setSpace] = SpaceData.useContext();
    const { name } = useParams();

    return (
        <div id="space-detail-page" className={className}>
            <h1>Space Detail</h1>
            <ErrorBoundary fallbackRender={
                    ({ resetErrorBoundary, ...props}) =>
                    <ErrorAlert {...props}>
                        {{
                            head: "Error",
                            body: <>
                                An error occurred while loading the space details. Details in the console.
                                <br />
                                <Alert.Link onClick={resetErrorBoundary}>
                                    Click here to try again
                                </Alert.Link>
                            </>
                        }}
                    </ErrorAlert>
            }>
                <SuspenseBoundary
                    fallback={
                        <LoadingAlert>
                            {{
                                head: "Loading...",
                                body: "Getting space details. Please wait."
                            }}
                        </LoadingAlert>
                    }

                    init={async () => {
                        if (space === null) {
                            // Populate the name and pull all the data
                            const newSpace = setSpace({ name })!;
                            await newSpace.pull();
                        }
                    }}
                >
                    
                    <SpaceDetailPageBody />
                </SuspenseBoundary>
            </ErrorBoundary>
        </div>
    );
}

function SpaceDetailPageBody() {
    const [space] = SpaceData.useContext();

    const aliasesText = useMemo(() => {
        if (space === null) return "If you see this, something is wrong.";

        if (space.aliases.size > 0) {
            return "AKA" + listInPlainEnglish(Array.from(space.aliases).map((i) => `"${i}"`), {conjunction: "or"});
        } else {
            return "";
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [space, space?.aliases]);

    const examplesElements = useMemo(() => {
        if (space === null) return [];
        return Array.from(space.examples).map((example, i) => {
            return (
                <li key={"example-" + i}>{example}</li>
            );
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [space, space?.examples]);

    const tagsElements = useMemo(() => {
        if (space === null) return [];
        return Array.from(space.tags).map((tag) => {
            return (
                <TagBadge key={"tag-" + tag} tag={tag} pill={true} className="me-1 mb-2" />
            );
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [space, space?.tags]);

    if (space === null) return null;
    return (
        <div className="space-detail-page-body">
            <h2>{space.name}</h2>
            <p className="mb-0"><b>{aliasesText}</b></p>
            {tagsElements}

            <h3>Description</h3>
            <MarkdownRenderer
                baseHLevel={4}
            >
                {space.description ?? "No description provided."}
            </MarkdownRenderer>

            <h3>Examples</h3>
            <ul>
                {
                    examplesElements.length > 0 ?
                        examplesElements:
                    // Else
                    "None"
                }
            </ul>
        </div>
    );
}