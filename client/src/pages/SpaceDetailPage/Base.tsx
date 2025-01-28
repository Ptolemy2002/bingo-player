import DefaultErrorAlert from 'src/components/ErrorAlert';
import DefaultLoadingAlert from 'src/components/LoadingAlert';
import { SpaceDetailPageProps } from './Types';
import { ErrorBoundary } from 'react-error-boundary';
import { Alert } from 'react-bootstrap';
import { SuspenseBoundary } from '@ptolemy2002/react-suspense';
import SpaceData from 'src/data/SpaceData';
import { useParams } from 'react-router';

export default function SpaceDetailPageBase({
    className,
    ErrorAlert=DefaultErrorAlert,
    LoadingAlert=DefaultLoadingAlert
}: SpaceDetailPageProps["functional"]) {
    const [space, setSpace] = SpaceData.useContext();
    const { name } = useParams();

    console.log(space);
    return (
        <div id="space-detail-page" className={className}>
            <h1>Space Detail</h1>
            <ErrorBoundary fallbackRender={
                    ({ resetErrorBoundary, ...props}) =>
                    <ErrorAlert {...props}>
                        {{
                            head: "Error",
                            body: <>
                                An error occurred while loading the space details. Details in the console.
                                <br />
                                <Alert.Link onClick={resetErrorBoundary}>
                                    Click here to try again
                                </Alert.Link>
                            </>
                        }}
                    </ErrorAlert>
            }>
                <SuspenseBoundary
                    fallback={
                        <LoadingAlert>
                            {{
                                head: "Loading...",
                                body: "Getting space details. Please wait."
                            }}
                        </LoadingAlert>
                    }

                    init={async () => {
                        if (space === null) {
                            // Populate the name and pull all the data
                            const newSpace = setSpace({ name })!;
                            await newSpace.pull();
                        }
                    }}
                >
                    Test
                </SuspenseBoundary>
            </ErrorBoundary>
        </div>
    );
}