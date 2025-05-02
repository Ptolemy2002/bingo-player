import ErrorAlert from 'src/components/alerts/ErrorAlert';
import LoadingAlert from 'src/components/alerts/LoadingAlert';
import { SpaceEditPageBodyProps, SpaceEditPageProps } from './Types';
import { ErrorBoundary } from 'react-error-boundary';
import { Alert } from 'react-bootstrap';
import { SuspenseBoundary } from '@ptolemy2002/react-suspense';
import SpaceData from 'src/data/SpaceData';
import { useParams } from 'react-router';
import { useCallback, useMemo, useState } from 'react';
import { MarkdownRenderer } from 'src/lib/Markdown';
import useManualErrorHandling from '@ptolemy2002/react-manual-error-handling';
import { AxiosError } from 'axios';
import NotFoundPage from 'src/pages/NotFoundPage';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MongoSpace, ZodMongoSpaceSchema } from 'shared';
import { Form } from 'react-bootstrap';
import StyledButton from 'src/components/StyledButton';
import SpaceTagList from 'src/context/SpaceTagList';
import DefaultNameField from './NameField';
import DefaultAliasesField from './AliasesField';

function SpaceEditPageBase({
    className,
    NameField = DefaultNameField,
    AliasesField = DefaultAliasesField,
    ...props
}: SpaceEditPageProps["functional"]) {
    const [space, setSpace] = SpaceData.useContext();
    const [is404, setIs404] = useState(false);
    const { name } = useParams();
    const { _try } = useManualErrorHandling();
    const [spaceTagList] = SpaceTagList.useContext([]);

    if (is404) return <NotFoundPage />;
    return (
        <div id="space-edit-page" className={className} {...props}>
            <h1>Space Edit</h1>
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
                        let spaceToCheckpoint = space;

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

                            if (!spaceTagList.hasInProgressRequest()) await spaceTagList.tagsRequest();
                            
                            spaceToCheckpoint = newSpace;
                        }

                        spaceToCheckpoint!.checkpoint("pre-edit");
                    }}
                >
                    
                    <SpaceEditPageBody
                        NameField={NameField}
                        AliasesField={AliasesField}
                    />
                </SuspenseBoundary>
            </ErrorBoundary>
        </div>
    );
}

function SpaceEditPageBody({
    NameField = DefaultNameField,
    AliasesField = DefaultAliasesField,
}: SpaceEditPageBodyProps) {
    const [space] = SpaceData.useContext();

    const formMethods = useForm({
        resolver: zodResolver(ZodMongoSpaceSchema)
    });

    const {
        handleSubmit,
        formState: {submitCount, errors}
    } = formMethods;

    const examplesElements = useMemo(() => {
        if (space === null) return [];
        return Array.from(space.examples).map((example, i) => {
            return (
                <li key={"example-" + i}>{example}</li>
            );
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [space, space?.examples]);

    const onSubmit = useCallback((items: MongoSpace) => {
        console.log("Submit", items);
    }, []);

    const aliasesArray = useMemo(() => {
        if (space === null) return [];
        return Array.from(space.aliases);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [space?.aliases]);

    if (space === null) return null;
    return (
        <FormProvider {...formMethods}>
            <div className="space-edit-page-body">
                {
                    errors.root &&
                        <ErrorAlert key={submitCount} dismissible>
                            {{
                                head: "Update Error",
                                body: errors.root.message
                            }}
                        </ErrorAlert>
                }

                <Form onSubmit={handleSubmit(onSubmit)}>
                    <NameField 
                        className='mb-3'
                        defaultValue={space.name}
                    />

                    <AliasesField
                        className='mb-3'
                        defaultValue={aliasesArray}
                    />

                    <Form.Group className="mb-3">
                        <Form.Label>Tags</Form.Label> <br />
                    </Form.Group>

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

                    <StyledButton
                        $variant="spaceEditSubmit"
                        type="submit"
                        disabled={submitCount > 0 && Object.keys(errors).length > 0}
                    >
                        Save Changes
                    </StyledButton>
                </Form>
            </div>
        </FormProvider>
    );
}

export function applySubComponents<
    T extends typeof SpaceEditPageBase
>(C: T) {
    return Object.assign(C, {
        Body: SpaceEditPageBody,
        NameField: DefaultNameField,
        AliasesField: DefaultAliasesField
    });
}

export default applySubComponents(SpaceEditPageBase);