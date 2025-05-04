import { ArrayPath, useFieldArray, useFormContext } from "react-hook-form";
import { MongoSpace } from "shared";
import { SpaceEditAliasesFieldProps, SpaceEditAliasItemProps } from "./Types";
import { Form } from "react-bootstrap";
import StyledButton from "src/components/StyledButton";
import { useEffect } from "react";
import clsx from "clsx";

export default function SpaceEditAliasesField({
    label="Aliases",
    placeholder="Alias",
    defaultValue=[],
    ...props
}: SpaceEditAliasesFieldProps) {
    const {
        control,
        formState: { errors }
    } = useFormContext<MongoSpace>();

    const {
        fields: aliasesFields,
        append: appendAlias,
        remove: removeAlias
    } = useFieldArray({
        name: "aliases" as ArrayPath<MongoSpace>,
        control
    });

    // Sync the fields with the value provided
    useEffect(() => {
        // No arguments removes all fields
        removeAlias();
        for (let i = 0; i < defaultValue.length; i++) {
            appendAlias(defaultValue[i]);
        }
    }, [defaultValue, appendAlias, removeAlias]);

    return (
        <Form.Group {...props}>
            <Form.Label>{label}</Form.Label>
            <ul>
                {
                    aliasesFields.length > 0 ?
                        aliasesFields.map((field, i) => {
                            return (
                                <SpaceEditAliasItemField
                                    key={field.id}
                                    index={i}

                                    controlProps={{
                                        placeholder
                                    }}

                                    remove={() => removeAlias(i)}
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
                $variant="addAlias"
                onClick={() => appendAlias("Alias " + (aliasesFields.length + 1))}
            >
                Add Alias
            </StyledButton>

            {errors.aliases && <Form.Text className="text-danger">{errors.aliases.message}</Form.Text>}
        </Form.Group>
    );
}

export function SpaceEditAliasItemField({
    index,
    controlProps: {
        className: controlPropsClassName,
        placeholder="Alias",
        ...controlProps
    },
    remove,
    defaultValue,
    ...props
}: SpaceEditAliasItemProps) {
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
                {...formRegister(`aliases.${index}`)}
                defaultValue={defaultValue}
            />

            <StyledButton
                $variant="removeAlias"
                onClick={remove}
            >
                Remove
            </StyledButton>

            {errors.aliases && <Form.Text className="text-danger">{errors.aliases.message}</Form.Text>}
        </li>
    );
}