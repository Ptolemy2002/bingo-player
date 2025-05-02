import { Form } from "react-bootstrap";
import { SpaceEditNameFieldProps } from "./Types";
import { useFormContext } from "react-hook-form";
import { MongoSpace } from "shared";

function SpaceEditNameField({
    label="Name",
    placeholder="Name",
    defaultValue="",
    ...props
}: SpaceEditNameFieldProps) {
    const {
        register,
        formState: {errors}
    } = useFormContext<MongoSpace>();
    
    return (
        <Form.Group {...props}>
            <Form.Label>{label}</Form.Label>
            <Form.Control
                type="text"
                placeholder={placeholder}
                {...register("name")}
                defaultValue={defaultValue}
            />

            {errors.name && <Form.Text className="text-danger">{errors.name.message}</Form.Text>}
        </Form.Group>
    );
}

export default SpaceEditNameField;