import { PropsWithCustomChildren } from "@ptolemy2002/react-utils";
import { ReactNode } from "react";
import { Alert, AlertProps } from "react-bootstrap";

export type LoadingAlertProps = PropsWithCustomChildren<
    Omit<AlertProps, "variant" | "children">,
    {
        head: ReactNode;
        body: ReactNode;
    }
>;

function LoadingAlert({
    children: { head, body } = {},
    ...props
}: LoadingAlertProps) {
    return (
        <Alert variant="info" {...props}>
            {head && <Alert.Heading>
                {head}
            </Alert.Heading>}

            {body}
        </Alert>
    );
}

export function applySubComponents<
    T extends typeof LoadingAlert
>(C: T) {
    return Object.assign(C, {
        Heading: Alert.Heading,
        Link: Alert.Link
    });
}

export default applySubComponents(LoadingAlert);