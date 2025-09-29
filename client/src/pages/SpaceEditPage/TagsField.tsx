import { ArrayPath, useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { MongoSpace } from "shared";
import { SpaceEditTagsFieldProps, SpaceEditTagItemFieldProps } from "./Types";
import { Form } from "react-bootstrap";
import StyledButton from "src/components/StyledButton";
import { useEffect, useState } from "react";
import clsx from "clsx";
import SpaceTagList from "src/context/SpaceTagList";

export default function SpaceEditTagsField({
    label="Tags",
    placeholder="Tag",
    defaultValue=[],
    ...props
}: SpaceEditTagsFieldProps) {
    const {
        control
    } = useFormContext<MongoSpace>();

    const {
        fields: tagFields,
        append: appendTag,
        remove: removeTag
    } = useFieldArray({
        name: "tags" as ArrayPath<MongoSpace>,
        control
    });

    // Sync the fields with the value provided
    useEffect(() => {
        // No arguments removes all fields
        removeTag();
        for (let i = 0; i < defaultValue.length; i++) {
            appendTag(defaultValue[i]);
        }
    }, [defaultValue, appendTag, removeTag]);

    return (
        <Form.Group {...props}>
            <Form.Label>{label}</Form.Label>
            <ul>
                {
                    tagFields.length > 0 ?
                        tagFields.map((field, i) => {
                            return (
                                <SpaceEditTagItemField
                                    key={field.id}
                                    index={i}

                                    controlProps={{
                                        placeholder
                                    }}

                                    remove={() => removeTag(i)}
                                />
                            );
                        })
                    :
                        <li>
                            None Found
                        </li>

                }
            </ul>
            <StyledButton
                $variant="addTag"
                onClick={() => appendTag("_unselected")}
            >
                Add Tag
            </StyledButton>
        </Form.Group>
    );
}

export function SpaceEditTagItemField({
    index,
    controlProps: {
        className: controlPropsClassName,
        placeholder="Tag",
        ...controlProps
    },

    remove,
    defaultValue,
    ...props
}: SpaceEditTagItemFieldProps) {
    const {
        control,
        register: formRegister,
        setValue,
        formState: { errors }
    } = useFormContext<MongoSpace>();

    const tag = useWatch({
        control,
        name: `tags.${index}` as ArrayPath<MongoSpace>
    }) as string;

    const [tagList] = SpaceTagList.useContext(["tags"])
    const [select, setSelect] = useState<boolean | null>(null);
    
    const hasTagList = tagList.hasTags();
    useEffect(() => {
        // This should only run if we don't know if the initial value is in the tag list
        if (hasTagList && select === null) setSelect(tag === "_unselected" || tagList.getTags().includes(tag));
    }, [tag, hasTagList, tagList, select]);
    // Since _unselected starts with an underscore, it will not be accepted as a valid tag and the user will need to select one.

    return (
        <li {...props}>
            { select ?
                    <Form.Control
                        {...controlProps}
                        as="select"
                        className={clsx("mb-2", controlPropsClassName)}
                        placeholder={placeholder}
                        {...formRegister(`tags.${index}`)}
                        defaultValue={defaultValue}
                    >
                        <option value="_unselected">Select a tag...</option>
                        {tagList.sortTags().map((tag) => (
                            <option key={tag} value={tag}>{tag}</option>
                        ))}
                    </Form.Control>
                :
                    <Form.Control
                        {...controlProps}
                        type="text"
                        className={clsx("mb-2", controlPropsClassName)}
                        placeholder={placeholder}
                        {...formRegister(`tags.${index}`)}
                        defaultValue={defaultValue}
                    />
            }
            
            <div className="btn-row">
                <StyledButton
                    $variant="removeTag"
                    onClick={remove}
                >
                    Remove
                </StyledButton>

                { 
                    !select ?
                        <StyledButton
                            $variant="selectTagExisting"
                            onClick={() => {
                                setSelect(true);
                                if (hasTagList && !tagList.getTags().includes(tag)) {
                                    // If the tag is not in the list, we need to set it to _unselected
                                    setValue(`tags.${index}`, "_unselected", {
                                        shouldDirty: true,
                                        shouldTouch: true
                                    });
                                }
                            }}
                            
                            disabled={!hasTagList}
                        >
                            Select Existing
                        </StyledButton>
                    :
                        <StyledButton
                            $variant="writeTag"
                            onClick={() => {
                                setSelect(false);
                                setValue(`tags.${index}`, `tag-${index + 1}`, {
                                    shouldDirty: true,
                                    shouldTouch: true
                                });
                            }}
                        >
                            Write Your Own
                        </StyledButton>
                }
            </div>

            {errors.tags?.[index] && <Form.Text className="text-danger">{errors.tags[index].message}</Form.Text>}
        </li>
    );
}