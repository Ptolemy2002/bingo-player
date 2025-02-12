import { MouseEventHandler } from "react";
import { Alert } from "react-bootstrap";
import { FallbackProps } from "react-error-boundary";
import ErrorAlert from "src/components/alerts/ErrorAlert";

export type ErrorPageProps = FallbackProps & { onReset?: MouseEventHandler };

export default function ErrorPage({
    resetErrorBoundary
}: ErrorPageProps) {
    return (
        <div id="error-page">
            <ErrorAlert>
                {{
                    head: "Error",
                    body: <>
                        Something went wrong on the page. Details in the console.
                        <br />
                        <Alert.Link onClick={resetErrorBoundary}>
                            Click here to try again
                        </Alert.Link>
                    </>
                }}
            </ErrorAlert>
        </div>
    );
}