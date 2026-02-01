import { usePersistentState } from "@ptolemy2002/react-utils";
import { GamePageProps } from "./Types";
import { useParams } from "react-router";
import { BingoGameDataProvider, useBingoGameDataContext } from "src/context/BingoGameData";
import getSocket from "src/Socket";
import { useEffect } from "react";
import useManualErrorHandling from "@ptolemy2002/react-manual-error-handling";
import { SuspenseBoundary, useSuspenseController } from "@ptolemy2002/react-suspense";
import useForceRerender from "@ptolemy2002/react-force-rerender";

function GamePageBase({
    className
}: GamePageProps["functional"]) {
    const [name] = usePersistentState("bingoPlayerApp.name", "");
    const { gameId } = useParams();

    return (
        <BingoGameDataProvider value={null}>
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
    const forceRerender = useForceRerender();

    const { gameId } = useParams();

    // If this happens, the error will be caught at a boundary higher up.
    if (!gameId) throw new Error("Game ID is required in the URL parameters.");

    const socket = getSocket();
    const socketId = socket.id ?? null;
    
    useEffect(() => {
        if (!socketId) {
            // Try again in a bit
            const timeout = setTimeout(() => {
                forceRerender();
            }, 100);

            return () => clearTimeout(timeout);
        }

        if (!game) {
            _try(() => suspend(async () => {
                const res = await socket.emitSafeWithAck("gameGet", { id: gameId });
                setGame(res.game);
            }));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socketId, game]);

    if (!game) return null;

    const isHere = game.hasPlayerBySocketId(socketId!);
    const myRole = isHere ? game.getPlayerBySocketId(socketId!)!.role : null;

    return (
        <div>
            <p>Game ID: {game.id}</p>
            <p>Number of Players: {game.players.length} ({isHere ? "Including you" : "Not including you"})</p>
            <p>Number of Board Templates: {game.boardTemplates.length}</p>
            <p>Number of Boards: {game.boards.length}</p>
            <p>Number of Spaces Involved: {game.spaces.length}</p>

            <p>You are {
                myRole === "host" ? "hosting" :
                myRole === "player" ? "playing" :
                myRole === "spectator" ? "spectating" :
                "not involved in"
            } this game.</p>
        </div>
    );
}

export function applySubComponents<
    T extends typeof GamePageBase
>(C: T) {
    return Object.assign(C, {});
}

export default applySubComponents(GamePageBase);