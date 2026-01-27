import { usePersistentState } from "@ptolemy2002/react-utils";
import { GamePageProps } from "./Types";
import { useParams } from "react-router";
import { BingoGameDataProvider, useBingoGameDataContext } from "src/context/BingoGameData";
import getSocket from "src/Socket";
import { useEffect } from "react";
import useManualErrorHandling from "@ptolemy2002/react-manual-error-handling";
import { SuspenseBoundary, useSuspenseController } from "@ptolemy2002/react-suspense";

function GamePageBase({
    className
}: GamePageProps["functional"]) {
    const [name] = usePersistentState("bingoPlayerApp.name", "");
    const { gameId } = useParams();

    // If this happens, the error will be caught at a boundary higher up.
    if (!gameId) throw new Error("Game ID is required in the URL parameters.");

    return (
        <BingoGameDataProvider value={{id: gameId ?? ""}}>
            <div id="game-page" className={className}>
                <p>This is a page for {name} to view the Bingo Game with ID [{gameId}] and manage boards.</p>

                <SuspenseBoundary fallback={<p>Loading Game Data...</p>}>
                    <GamePageBody />
                </SuspenseBoundary>
            </div>
        </BingoGameDataProvider>
    );
}

export function GamePageBody() {
    const [game, setGame] = useBingoGameDataContext();
    const [{ suspend }] = useSuspenseController();
    const { _try } = useManualErrorHandling();

    const socket = getSocket();
    const socketId = socket.id ?? null;
    
    useEffect(() => {
        if (!socketId) {
            return;
        }

        _try(() => suspend(async () => {
            const res = await socket.emitSafeWithAck("gameGet", { id: game.id });
            setGame(res.game);
        }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socketId, setGame]);

    if (!game) return null;

    return (
        // TODO: Implement the actual game page body here.
        null
    );
}

export function applySubComponents<
    T extends typeof GamePageBase
>(C: T) {
    return Object.assign(C, {});
}

export default applySubComponents(GamePageBase);