import { Alert } from "react-bootstrap";
import { FallbackProps } from "react-error-boundary";

export default function ErrorPage({
    resetErrorBoundary
}: FallbackProps) {
    return (
        <div id="error-page">
            <Alert variant="danger">
                <Alert.Heading>
                    Error
                </Alert.Heading>

                Something went wrong on the page. Details in the console.
                <br />
                <Alert.Link onClick={resetErrorBoundary}>
                    Click here to try again
                </Alert.Link>
            </Alert>
        </div>
    );
}