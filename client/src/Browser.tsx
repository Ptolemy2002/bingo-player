import { Row } from 'react-bootstrap';
import { Outlet } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import NotFoundPage from 'src/pages/NotFoundPage';

export function PageLayout() {
    return <>
        <Row as="main">
            <Outlet />
        </Row>
    </>;
}

export const router = createBrowserRouter([{
    path: "/",
    element: <PageLayout />,
    
    // These children will be rendered inside the Outlet in the PageLayout component
    children: [
        {
            path: "/",
            element: <div>Home</div>
        },

        // The reason we don't use errorElement here is because we want to render the NotFoundPage
        // within our classical layout instead of as its own separate component
        {
            path: "*",
            element: <NotFoundPage />
        }
    ]
}]);