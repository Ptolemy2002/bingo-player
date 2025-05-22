import { Form } from "react-bootstrap";
import { SpaceEditDescriptionFieldProps } from "./Types";
import { useFormContext, useWatch } from "react-hook-form";
import { MongoSpace } from "shared";
import { MarkdownRenderer } from "src/lib/Markdown";

function SpaceEditDescriptionField({
    label="Description",
    placeholder="Description",
    defaultValue=null,
    baseHLevel=4,
    rows=5,
    ...props
}: SpaceEditDescriptionFieldProps) {
    const {
        register,
        formState: {errors},
        control
    } = useFormContext<MongoSpace>();
    
    // Watch the description field to update the Markdown renderer
    // whenever the value changes
    const { description } = useWatch({
        control
    });
    
    return (
        <Form.Group {...props}>
            <Form.Label>{label}</Form.Label>
            <Form.Control
                as="textarea"
                type="text"
                placeholder={placeholder}
                {...register("description")}
                defaultValue={defaultValue ?? ""}
                rows={rows}
            />

            <Form.Label>{label} - Preview</Form.Label>
            <MarkdownRenderer
                baseHLevel={baseHLevel}
            >
                {description || "No description provided."}
            </MarkdownRenderer>

            {errors.description && <Form.Text className="text-danger">{errors.description.message}</Form.Text>}
        </Form.Group>
    );
}

export default SpaceEditDescriptionField;