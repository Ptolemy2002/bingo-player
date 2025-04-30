import { Form } from "react-bootstrap";
import { SpaceEditNameFieldProps } from "./Types";

function SpaceEditNameField({
    label="Name",
    placeholder="Name",
    register,
    errors={},
    defaultValue="",
    ...props
}: SpaceEditNameFieldProps) {
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