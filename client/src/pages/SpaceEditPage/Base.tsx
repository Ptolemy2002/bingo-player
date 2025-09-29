import ErrorAlert from 'src/components/alerts/ErrorAlert';
import LoadingAlert from 'src/components/alerts/LoadingAlert';
import { SpaceEditPageBodyProps, SpaceEditPageProps } from './Types';
import { ErrorBoundary } from 'react-error-boundary';
import { Alert } from 'react-bootstrap';
import { SuspenseBoundary } from '@ptolemy2002/react-suspense';
import SpaceData from 'src/data/SpaceData';
import { useParams } from 'react-router';
import { useCallback, useMemo, useState } from 'react';
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
import DefaultExamplesField from './ExamplesField';
import DefaultDescriptionField from './DescriptionField';
import DefaultTagsField from './TagsField';
import { omit } from '@ptolemy2002/ts-utils';
import { useNavigate } from 'react-router';

function SpaceEditPageBase({
    className,
    NameField = DefaultNameField,
    AliasesField = DefaultAliasesField,
    ExamplesField = DefaultExamplesField,
    DescriptionField = DefaultDescriptionField,
    TagsField = DefaultTagsField,
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

                        if (!spaceTagList.hasInProgressRequest()) await spaceTagList.tagsRequest();
                    }}
                >
                    
                    <SpaceEditPageBody
                        NameField={NameField}
                        AliasesField={AliasesField}
                        ExamplesField={ExamplesField}
                        DescriptionField={DescriptionField}
                        TagsField={TagsField}
                    />
                </SuspenseBoundary>
            </ErrorBoundary>
        </div>
    );
}

function SpaceEditPageBody({
    NameField = DefaultNameField,
    AliasesField = DefaultAliasesField,
    ExamplesField = DefaultExamplesField,
    DescriptionField = DefaultDescriptionField,
    TagsField = DefaultTagsField
}: SpaceEditPageBodyProps) {
    const [space] = SpaceData.useContext();

    const formMethods = useForm({
        resolver: zodResolver(ZodMongoSpaceSchema),
    });

    const {
        handleSubmit,
        setValue,
        formState: {submitCount, errors}
    } = formMethods;

    const navigate = useNavigate();

    const goBack = useCallback(() => {
        navigate(`/space/${encodeURIComponent(space!.name)}`);
    }, [navigate, space]);

    const onSubmit = useCallback(async (_items: MongoSpace) => {
        // Remove the ID from the items, as it was only there to pass validation
        // and we don't need it.
        const items = omit(_items, "_id");

        // We aren't saving yet because that will be done on the viewing page.
        if (space === null) {
            throw new Error("Space is null, cannot submit.");
        }

        space.checkpoint("pre-edit");
        space.fromJSON(items);
        goBack();
    }, [space, goBack]);

    const aliasesArray = useMemo(() => {
        if (space === null) return [];
        return Array.from(space.aliases);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [space?.aliases]);

    const examplesArray = useMemo(() => {
        if (space === null) return [];
        return Array.from(space.examples);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [space?.examples]);

    const tagsArray = useMemo(() => {
        if (space === null) return [];
        return Array.from(space.tags);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [space?.tags]);

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

                <Form onSubmit={(...args) => {
                    // Set the ID to make sure we pass checks.
                    setValue("_id", space.id, {
                        shouldDirty: false,
                        shouldTouch: false,
                        shouldValidate: false,
                    });

                    return handleSubmit(onSubmit)(...args)
                }}>
                    <NameField 
                        className='mb-3'
                        defaultValue={space.name}
                    />

                    <AliasesField
                        className='mb-3'
                        defaultValue={aliasesArray}
                    />

                    <TagsField
                        className='mb-3'
                        defaultValue={tagsArray}
                    />

                    <DescriptionField
                        className='mb-3'
                        defaultValue={space.description}
                        baseHLevel={4}
                    />

                    <ExamplesField
                        className='mb-3'
                        defaultValue={examplesArray}
                    />
                    
                    <div className='btn-row'>
                        <StyledButton
                            $variant="spaceEditSubmit"
                            type="submit"
                            disabled={submitCount > 0 && Object.keys(errors).length > 0}
                        >
                            Save Changes
                        </StyledButton>

                        <StyledButton
                            $variant="spaceEditCancel"
                            type="button"
                            onClick={goBack}
                        >
                            Cancel
                        </StyledButton>
                    </div>
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
        AliasesField: DefaultAliasesField,
        DescriptionField: DefaultDescriptionField,
        ExamplesField: DefaultExamplesField,
        TagsField: DefaultTagsField,
    });
}

export default applySubComponents(SpaceEditPageBase);