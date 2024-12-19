import { Outlet } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import NotFoundPage from 'src/pages/NotFoundPage';
import Header from 'src/components/Header';
import Footer from 'src/components/Footer';

export function PageLayout() {
    return <>
        <Header title="Bingo Player" />
        <main>
            <Outlet />
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
            element: <div>
                Welcome to Bingo Player!
            </div>
        },

        // The reason we don't use errorElement here is because we want to render the NotFoundPage
        // within our classical layout instead of as its own separate component
        {
            path: "*",
            element: <NotFoundPage />
        }
    ]
}]);