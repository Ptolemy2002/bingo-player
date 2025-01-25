import LoadingAlert from "src/components/LoadingAlert";

export default function LoadingPage() {
    return (
        <div id="loading-page">
            <LoadingAlert>
                {{
                    head: "Loading...",
                    body: "Something on the page is loading. Please wait."
                }}
            </LoadingAlert>
        </div>
    );
}