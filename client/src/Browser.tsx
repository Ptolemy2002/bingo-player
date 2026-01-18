import { Outlet, useLocation } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import NotFoundPage from 'src/pages/NotFoundPage';
import Header from 'src/components/Header';
import Footer from 'src/components/Footer';
import HomePage from './pages/HomePage';
import { SuspenseBoundary } from '@ptolemy2002/react-suspense';
import LoadingPage from 'src/pages/LoadingPage';
import SpaceGalleryPage from 'src/pages/SpaceGalleryPage';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorPage from 'src/pages/ErrorPage';
import SpaceDetailPage from './pages/SpaceDetailPage';
import SpaceEditPage from './pages/SpaceEditPage';
import GamePage from './pages/GamePage';
import SocketTestPage from './pages/SocketTestPage';

export function PageLayout() {
    const location = useLocation();

    return <>
        <Header title="Bingo Player" />
        <main>
            <ErrorBoundary FallbackComponent={ErrorPage} key={location.pathname}>
                <SuspenseBoundary
                    fallback={<LoadingPage />}
                >
                    <Outlet />
                </SuspenseBoundary>
            </ErrorBoundary>
        </main>
        <Footer>
            Ptolemy Henson
        </Footer>
    </>;
}

export const router = createBrowserRouter([{
    path: "/",
    element: <PageLayout />,
    // Errors that are not 404 and are not caught by a lower-level ErrorBoundary
    // will be caught by this, should they occur
    errorElement: <p id="fatal-error">Fatal Error</p>,
    
    // These children will be rendered inside the Outlet in the PageLayout component
    children: [
        {
            path: "/",
            element: <HomePage />
        },

        {
            path: "/socket-test",
            element: <SocketTestPage />
        },

        {
            path: "/space-gallery",
            element: <SpaceGalleryPage />
        },

        {
            path: "/space/:name",
            element: <SpaceDetailPage />
        },

        {
            path: "/space/:name/edit",
            element: <SpaceEditPage />
        },

        {
            path: "/game/:gameId",
            element: <GamePage />
        },

        // The reason we don't use errorElement here is because we want to render the NotFoundPage
        // within our classical layout instead of as its own separate component
        {
            path: "*",
            element: <NotFoundPage />
        }
    ]
}]);