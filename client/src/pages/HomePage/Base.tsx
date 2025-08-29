import { usePersistentState } from "@ptolemy2002/react-utils";
import DefaultNameField from "./NameFieldStyled";
import { HomePageProps } from "./Types";
import { SuspenseBoundary } from "@ptolemy2002/react-suspense";

function HomePage({
    NameField = DefaultNameField
}: HomePageProps) {
    const [name] = usePersistentState("bingoPlayerApp.name", "");

    return (
        <div id="home-page">
            <p>Welcome to Bingo Player! From here, you can enter games and play bingo.</p>
            <NameField />

            {
                name ? (
                    <SuspenseBoundary fallback={<p>Loading Game List...</p>}>
                        <ul>
                            <li>To Be Implemented</li>
                        </ul>
                    </SuspenseBoundary>
                ) : (
                    <p>Please enter your name to start viewing and joining games.</p>
                )
            }
        </div>
    );
}
export function applySubComponents<
    T extends typeof HomePage
>(C: T) {
    return Object.assign(C, {
        NameField: DefaultNameField
    });
}

export default applySubComponents(HomePage);