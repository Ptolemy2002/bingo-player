import { Form } from "react-bootstrap";
import { NameFieldProps } from "./Types";
import clsx from "clsx";

function NameFieldBase({
    name,
    setName,
    className
}: NameFieldProps["functional"]) {
    return (
        <Form className={clsx("name-field", className)}>
            <Form.Label htmlFor="name">Name</Form.Label>
            <Form.Control
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
            />
        </Form>
    );
}

export function applySubComponents<
    T extends typeof NameFieldBase
>(C: T) {
    return Object.assign(C, {});
}

export default applySubComponents(NameFieldBase);