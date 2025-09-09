import clsx from "clsx";
import { GameListProps } from "./Types";
import { useSuspenseController } from "@ptolemy2002/react-suspense";
import useManualErrorHandling from "@ptolemy2002/react-manual-error-handling";
import { useEffect, useState } from "react";
import { BingoGame } from "shared";
import getSocket from "src/Socket";

function GameListBase({
    className,
    socketId,
    category="all"
}: GameListProps["functional"]) {
    const [games, setGames] = useState<BingoGame[]>([]);
    const [{suspend}] = useSuspenseController();
    const { _try } = useManualErrorHandling();
    const socket = getSocket();

    useEffect(() => {
        _try(() => suspend(async () => {
            const res = await socket.emitSafeWithAck("gameList", { mine: category === "mine" });
            if (!socketId || category === "mine" || category === "all") {
                setGames(res.games);
            } else {
                setGames(res.games.filter((g: BingoGame) => g.players.find(p => p.socketId === socketId) == null));
            }

        }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category, socketId]);

    return (
        <ul className={clsx("game-list", className)}>
            {
                games.length > 0 ? (
                    games.map(g => (
                        <li key={g.id}>
                            {g.id}
                        </li>
                    ))
                ) : (
                    <li>Nothing here</li>
                )
            }
        </ul>
    );
}

export function applySubComponents<
    T extends typeof GameListBase
>(C: T) {
    return Object.assign(C, {});
}

export default applySubComponents(GameListBase);