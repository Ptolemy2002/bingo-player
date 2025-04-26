import ErrorAlert from 'src/components/alerts/ErrorAlert';
import LoadingAlert from 'src/components/alerts/LoadingAlert';
import { SpaceEditPageProps } from './Types';
import { ErrorBoundary } from 'react-error-boundary';
import { Alert } from 'react-bootstrap';
import { SuspenseBoundary } from '@ptolemy2002/react-suspense';
import SpaceData from 'src/data/SpaceData';
import { useParams } from 'react-router';
import TagBadge from 'src/components/TagBadge';
import { useCallback, useMemo, useState } from 'react';
import { MarkdownRenderer } from 'src/lib/Markdown';
import useManualErrorHandling from '@ptolemy2002/react-manual-error-handling';
import { AxiosError } from 'axios';
import NotFoundPage from 'src/pages/NotFoundPage';
import { ArrayPath, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MongoSpace, ZodMongoSpaceSchema } from 'shared';
import { Form } from 'react-bootstrap';
import StyledButton from 'src/components/StyledButton';

function SpaceEditPageBase({
    className
}: SpaceEditPageProps["functional"]) {
    const [space, setSpace] = SpaceData.useContext();
    const [is404, setIs404] = useState(false);
    const { name } = useParams();
    const { _try } = useManualErrorHandling();

    if (is404) return <NotFoundPage />;
    return (
        <div id="space-edit-page" className={className}>
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
                            
                            spaceToCheckpoint = newSpace;
                        }

                        spaceToCheckpoint!.checkpoint("pre-edit");
                    }}
                >
                    
                    <SpaceEditPageBody />
                </SuspenseBoundary>
            </ErrorBoundary>
        </div>
    );
}

function SpaceEditPageBody() {
    const [space] = SpaceData.useContext();

    const {
        register: formRegister, handleSubmit, setError,
        control,
        formState: {submitCount, errors}
    } = useForm({
        resolver: zodResolver(ZodMongoSpaceSchema)
    });

    const {
        fields: aliasesFields,
        append: appendAlias,
        remove: removeAlias,
    } = useFieldArray({
        name: "aliases" as ArrayPath<MongoSpace>,
        control
    });

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

    const onSubmit = useCallback((items: MongoSpace) => {
        console.log("Submit", items);
    }, []);

    if (space === null) return null;
    return (
        <div className="space-edit-page-body">
            {
                errors.root &&
                    <ErrorAlert key={submitCount} dismissible>
                        {{
                            head: "Login Error",
                            body: errors.root.message
                        }}
                    </ErrorAlert>
            }

            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Name"
                        {...formRegister("name")}
                        defaultValue={space.name}
                    />
                    {errors.name && <Form.Text className="text-danger">{errors.name.message}</Form.Text>}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Aliases</Form.Label>
                    <ul>
                        {
                            aliasesFields.length > 0 ?
                                aliasesFields.map((field, i) => {
                                    return (
                                        <li key={field.id}>
                                            <Form.Control
                                                type="text"
                                                className="mb-2"
                                                placeholder="Alias"
                                                {...formRegister(`aliases.${i}`)}
                                                defaultValue={Array.from(space.aliases)[i]}
                                            />

                                            <StyledButton
                                                $variant="removeAlias"
                                                onClick={() => removeAlias(i)}
                                            >
                                                Remove
                                            </StyledButton>
                                        </li>
                                    );
                                })
                            :
                                <li>
                                    None Found
                                </li>

                        }
                    </ul>

                    <StyledButton
                        $variant="addAlias"
                        onClick={() => appendAlias("Alias " + (aliasesFields.length + 1))}
                    >
                        Add Alias
                    </StyledButton>
                </Form.Group>


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

                <StyledButton
                    $variant="spaceEditSubmit"
                    type="submit"
                    disabled={submitCount > 0 && Object.keys(errors).length > 0}
                >
                    Submit
                </StyledButton>
            </Form>
        </div>
    );
}

export function applySubComponents<
    T extends typeof SpaceEditPageBase
>(C: T) {
    return Object.assign(C, {
        Body: SpaceEditPageBody
    });
}

export default applySubComponents(SpaceEditPageBase);