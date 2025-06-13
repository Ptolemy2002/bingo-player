import { ArrayPath, useFieldArray, useFormContext } from "react-hook-form";
import { MongoSpace } from "shared";
import { SpaceEditExamplesFieldProps, SpaceEditExampleItemFieldProps } from "./Types";
import { Form } from "react-bootstrap";
import StyledButton from "src/components/StyledButton";
import { useEffect } from "react";
import clsx from "clsx";

export default function SpaceEditExamplesField({
    label="Examples",
    placeholder="Example",
    defaultValue=[],
    ...props
}: SpaceEditExamplesFieldProps) {
    const {
        control
    } = useFormContext<MongoSpace>();

    const {
        fields: exampleFields,
        append: appendExample,
        remove: removeExample
    } = useFieldArray({
        name: "examples" as ArrayPath<MongoSpace>,
        control
    });

    // Sync the fields with the value provided
    useEffect(() => {
        // No arguments removes all fields
        removeExample();
        for (let i = 0; i < defaultValue.length; i++) {
            appendExample(defaultValue[i]);
        }
    }, [defaultValue, appendExample, removeExample]);

    return (
        <Form.Group {...props}>
            <Form.Label>{label}</Form.Label>
            <ul>
                {
                    exampleFields.length > 0 ?
                        exampleFields.map((field, i) => {
                            return (
                                <SpaceEditExampleItemField
                                    key={field.id}
                                    index={i}

                                    controlProps={{
                                        placeholder
                                    }}

                                    remove={() => removeExample(i)}
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
                $variant="addExample"
                onClick={() => appendExample("Example " + (exampleFields.length + 1))}
            >
                Add Example
            </StyledButton>
        </Form.Group>
    );
}

export function SpaceEditExampleItemField({
    index,
    controlProps: {
        className: controlPropsClassName,
        placeholder="Example",
        ...controlProps
    },
    remove,
    defaultValue,
    ...props
}: SpaceEditExampleItemFieldProps) {
    const {
        register: formRegister,
        formState: { errors }
    } = useFormContext<MongoSpace>();

    return (
        <li {...props}>
            <Form.Control
                {...controlProps}
                type="text"
                className={clsx("mb-2", controlPropsClassName)}
                placeholder={placeholder}
                {...formRegister(`examples.${index}`)}
                defaultValue={defaultValue}
            />

            <div className="btn-row">
                <StyledButton
                    $variant="removeExample"
                    onClick={remove}
                >
                    Remove
                </StyledButton>
            </div>

            {errors.examples?.[index] && <Form.Text className="text-danger">{errors.examples[index].message}</Form.Text>}
        </li>
    );
}