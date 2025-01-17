import { Outlet } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import NotFoundPage from 'src/pages/NotFoundPage';
import Header from 'src/components/Header';
import Footer from 'src/components/Footer';
import HomePage from './pages/HomePage';
import { SuspenseBoundary } from '@ptolemy2002/react-suspense';
import LoadingPage from 'src/pages/LoadingPage';
import SpaceGalleryPage from 'src/pages/SpaceGalleryPage';

export function PageLayout() {
    return <>
        <Header title="Bingo Player" />
        <main>
            <SuspenseBoundary
                fallback={<LoadingPage />}
            >
                <Outlet />
            </SuspenseBoundary>
        </main>
        <Footer>
            Ptolemy Henson
        </Footer>
    </>;
}

export const router = createBrowserRouter([{
    path: "/",
    element: <PageLayout />,
    
    // These children will be rendered inside the Outlet in the PageLayout component
    children: [
        {
            path: "/",
            element: <HomePage />
        },

        {
            path: "/space-gallery",
            element: <SpaceGalleryPage />
        },

        // The reason we don't use errorElement here is because we want to render the NotFoundPage
        // within our classical layout instead of as its own separate component
        {
            path: "*",
            element: <NotFoundPage />
        }
    ]
}]);