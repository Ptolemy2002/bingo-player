import { Alert } from "react-bootstrap";

export default function LoadingPage() {
    return (
        <div id="loading-page">
            <Alert variant="info">
                <Alert.Heading>
                    Loading...
                </Alert.Heading>

                Something on the page is loading. Please wait.
            </Alert>
        </div>
    );
}