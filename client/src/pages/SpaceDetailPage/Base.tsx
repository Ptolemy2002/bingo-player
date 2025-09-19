import ErrorAlert from 'src/components/alerts/ErrorAlert';
import LoadingAlert from 'src/components/alerts/LoadingAlert';
import { SpaceDetailPageProps } from './Types';
import { ErrorBoundary } from 'react-error-boundary';
import { Alert } from 'react-bootstrap';
import { SuspenseBoundary } from '@ptolemy2002/react-suspense';
import SpaceData from 'src/data/SpaceData';
import { useNavigate, useParams } from 'react-router';
import TagBadge from 'src/components/TagBadge';
import { listInPlainEnglish } from '@ptolemy2002/js-utils';
import { useMemo, useState } from 'react';
import { MarkdownRenderer } from 'src/lib/Markdown';
import useManualErrorHandling from '@ptolemy2002/react-manual-error-handling';
import { AxiosError } from 'axios';
import NotFoundPage from '../NotFoundPage';
import StyledButton from 'src/components/StyledButton';

export function SpaceDetailPageBase({
    className
}: SpaceDetailPageProps["functional"]) {
    const [space, setSpace] = SpaceData.useContext();
    const [is404, setIs404] = useState(false);
    const { name } = useParams();
    const { _try } = useManualErrorHandling();

    if (is404) return <NotFoundPage />;
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
                        if (space === null || space.name !== name) {
                            // Populate the name and pull all the data
                            const newSpace = setSpace({ name })!;
                            await _try(
                                () =>
                                    newSpace.pull()
                                    .catch((e: AxiosError) => {
                                        if (e.status === 404) {
                                            setIs404(true);
                                        } else {
                                            throw e;
                                        }
                                    })
                            );
                        }
                    }}
                >
                    
                    <SpaceDetailPageBody />
                </SuspenseBoundary>
            </ErrorBoundary>
        </div>
    );
}

export function SpaceDetailPageBody() {
    const [space] = SpaceData.useContext(null, undefined, (curr, prev) => console.log("Reinit from", prev, "to", curr), true);
    const navigate = useNavigate();
    const { _try } = useManualErrorHandling();

    const aliasesText = useMemo(() => {
        if (space === null) return "If you see this, something is wrong.";

        if (space.aliases.size > 0) {
            return "AKA " + listInPlainEnglish(Array.from(space.aliases).map((i) => `"${i}"`), {conjunction: "or"});
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

    console.log("Rendering SpaceDetailPageBody", {space});
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

            <div className='btn-row'>
                <StyledButton
                    $variant="spaceRefresh"
                    onClick={() => _try(() => space.pull(true))}
                    disabled={!space.allowRefresh()}
                >
                    {
                        space.hasInProgressRequest("pull") ?
                            "Refreshing..."
                        :
                            "Refresh"
                    }
                </StyledButton>

                <StyledButton
                    $variant="goToSpaceEdit"
                    onClick={() => navigate(`/space/${encodeURIComponent(space.name)}/edit`)}
                >
                    Edit
                </StyledButton>

                <StyledButton
                    $variant="spaceSave"
                    onClick={() => _try(() => space.push())}
                    disabled={!space.allowPush()}
                >
                    {
                        space.hasInProgressRequest("push") ?
                            "Saving..."
                        :
                            "Save Changes"
                    }
                </StyledButton>

                <StyledButton
                    $variant="spaceEditUndo"
                    disabled={!space.allowUndo()}
                    onClick={() => space.revert("pre-edit")}
                >
                    Undo Last Changes
                </StyledButton>

                <StyledButton
                    $variant="spaceDuplicate"
                    onClick={() => _try(async () => {
                        const newSpace = await space.duplicate();
                        if (newSpace) {
                            navigate(`/space/${encodeURIComponent(newSpace.name)}`);
                        } else {
                            throw new Error("Failed to duplicate space");
                        }
                    })}

                    disabled={!space.allowDuplicate()}
                >
                    {
                        space.hasInProgressRequest("duplicate") ?
                            "Duplicating..."
                        :
                            "Duplicate Space"
                    }
                </StyledButton>

                <StyledButton
                    $variant="spaceDelete"
                    onClick={() => _try(async () => {
                        await space.delete();
                        navigate("/space-gallery", { replace: true  });
                    })}

                    disabled={!space.allowDelete()}
                >
                    {
                        space.hasInProgressRequest("delete") ?
                            "Deleting..."
                        :
                            "Delete Space"
                    }
                </StyledButton>
            </div>
        </div>
    );
}

export function applySubComponents<
    T extends typeof SpaceDetailPageBase
>(C: T) {
    return Object.assign(C, {
        Body: SpaceDetailPageBody
    });
}

export default applySubComponents(SpaceDetailPageBase);