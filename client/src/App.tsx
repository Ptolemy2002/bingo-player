import { router } from "src/Browser";
import { RouterProvider } from "react-router";
import SpaceData from "src/data/SpaceData";
import SpaceTagList from "./context/SpaceTagList";

function App() {
    return (
        // Providing outside of the router
        // so that these do not get
        // reset when the page changes.
        // This is necessary to allow editing
        // on one page, but then confirming/canceling
        // the changes on another.
        <SpaceData.Provider value={null}>
            <SpaceTagList.Provider>
                <RouterProvider router={router} />
            </SpaceTagList.Provider>
        </SpaceData.Provider>
    );
}

export default App;
