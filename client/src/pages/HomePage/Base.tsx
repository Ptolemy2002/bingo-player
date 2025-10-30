import { usePersistentState } from "@ptolemy2002/react-utils";
import DefaultNameField from "./NameFieldStyled";
import DefaultGameCreateField from "./GameCreateFieldStyled";
import DefaultGameList from "./GameListStyled";
import { GameListCategory, HomePageProps } from "./Types";
import { SuspenseBoundary } from "@ptolemy2002/react-suspense";
import { useState } from "react";
import { BingoGameCollectionProvider } from "src/context/BingoGameCollection";
import { Form } from "react-bootstrap";

function HomePageBase({
    NameField = DefaultNameField,
    GameCreateField = DefaultGameCreateField,
    GameList = DefaultGameList,
    className
}: HomePageProps["functional"]) {
    const [name] = usePersistentState("bingoPlayerApp.name", "");
    const [listCategory, setListCategory] = useState<GameListCategory>("all");

    return (
        <div id="home-page" className={className}>
            <BingoGameCollectionProvider value={[]}>
                <p>Welcome to Bingo Player! From here, you can enter games and play bingo.</p>
                <NameField />

                {
                    name ? (
                        <SuspenseBoundary fallback={<p>Loading Game List...</p>} renderDeps={[listCategory]}>
                            <Form.Select
                                className="list-category-select"
                                id="list-category-select"
                                onChange={e => setListCategory(e.target.value as GameListCategory)}
                                value={listCategory}
                            >
                                <option value="all">All Games</option>
                                <option value="mine">My Games</option>
                                <option value="not-mine">Other Games</option>
                            </Form.Select>

                            <GameList category={listCategory} />

                            <br />
                            <GameCreateField />
                        </SuspenseBoundary>
                    ) : (
                        <p>Please enter your name to start viewing and joining games.</p>
                    )
                }
            </BingoGameCollectionProvider>
        </div>
    );
}
export function applySubComponents<
    T extends typeof HomePageBase
>(C: T) {
    return Object.assign(C, {
        NameField: DefaultNameField,
    });
}

export default applySubComponents(HomePageBase);