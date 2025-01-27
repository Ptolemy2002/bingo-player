import { router } from "src/Browser";
import { RouterProvider } from "react-router";
import SpaceData from "src/data/SpaceData";

function App() {
    return (
        // Providing outside of the router
        // so that the SpaceData does not get
        // reset when the page changes.
        // This is necessary to allow editing
        // on one page, but then confirming/canceling
        // the changes on another.
        <SpaceData.Provider value={null}>
            <RouterProvider router={router} />
        </SpaceData.Provider>
    );
}

export default App;
