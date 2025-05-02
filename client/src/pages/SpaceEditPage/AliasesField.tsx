import { ArrayPath, useFieldArray, useFormContext } from "react-hook-form";
import { MongoSpace } from "shared";
import { SpaceEditAliasesFieldProps } from "./Types";
import { Form } from "react-bootstrap";
import StyledButton from "src/components/StyledButton";
import { useEffect } from "react";

function SpaceEditPageAliasesField({
    label="Aliases",
    placeholder="Alias",
    defaultValue=[],
    ...props
}: SpaceEditAliasesFieldProps) {
    const {
        register: formRegister,
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
                                <li key={field.id}>
                                    <Form.Control
                                        type="text"
                                        className="mb-2"
                                        placeholder={placeholder}
                                        {...formRegister(`aliases.${i}`)}
                                        defaultValue={defaultValue[i]}
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

            {errors.aliases && <Form.Text className="text-danger">{errors.aliases.message}</Form.Text>}
        </Form.Group>
    );
}

export default SpaceEditPageAliasesField;