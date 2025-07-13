import { usePersistentState } from "@ptolemy2002/react-utils";
import DefaultNameField from "./NameFieldStyled";
import { HomePageProps } from "./Types";

function HomePage({
    NameField = DefaultNameField
}: HomePageProps) {
    const [name, setName] = usePersistentState("bingoPlayerApp.name", "");

    return (
        <div id="home-page">
            <p>Welcome to Bingo Player! From here, you can enter games and play bingo.</p>
            <NameField name={name} setName={setName} />

            {
                name ? (
                    // TODO
                    null
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