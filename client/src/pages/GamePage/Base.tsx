import { usePersistentState } from "@ptolemy2002/react-utils";
import { GamePageProps } from "./Types";
import { useParams } from "react-router";

function GamePageBase({
    className
}: GamePageProps["functional"]) {
    const [name] = usePersistentState("bingoPlayerApp.name", "");
    const { gameId } = useParams();

    return (
        <div id="game-page" className={className}>
            <p>This is a page for {name} to view the Bingo Game with ID [{gameId}] and manage boards.</p>
        </div>
    );
}

export function applySubComponents<
    T extends typeof GamePageBase
>(C: T) {
    return Object.assign(C, {});
}

export default applySubComponents(GamePageBase);