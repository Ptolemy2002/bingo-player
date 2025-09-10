import clsx from "clsx";
import { GameListProps } from "./Types";
import { useSuspenseController } from "@ptolemy2002/react-suspense";
import useManualErrorHandling from "@ptolemy2002/react-manual-error-handling";
import { useEffect, useState } from "react";
import { BingoGameData, BingoGameCollection } from "shared";
import getSocket from "src/Socket";
import GameCard from "src/components/GameCard";
import { Col, Row } from "react-bootstrap";

function GameListBase({
    className,
    socketId,
    category="all",
    colSizeXs=12,
    colSizeSm=12,
    colSizeMd=6,
    colSizeLg=4,
    colSizeXl=3,
}: GameListProps["functional"]) {
    const [games, setGames] = useState<BingoGameData[]>([]);
    const [{suspend}] = useSuspenseController();
    const { _try } = useManualErrorHandling();
    const socket = getSocket();

    useEffect(() => {
        _try(() => suspend(async () => {
            if (!socketId) {
                // Skip fetch this time. When we get a value, we'll fetch again.
                setGames([]);
                return;
            }

            const res = await socket.emitSafeWithAck("gameList", { mine: category === "mine" });
            let gc = new BingoGameCollection(res.games);

            if (category === "not-mine") {
                gc = gc.filter(g => !g.hasPlayerBySocketId(socketId));
            }

            setGames(gc.getAllGames());
        }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category, socketId]);

    return (
        <div className={clsx("game-list", "card-container", className)}>
            {
                games.length > 0 ? (
                    <Row>
                        {games.map((game) => (
                            <Col
                                key={game.id}
                                xs={colSizeXs}
                                sm={colSizeSm}
                                md={colSizeMd}
                                lg={colSizeLg}
                                xl={colSizeXl}
                            >
                                <GameCard game={game} />
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <i>Nothing here</i>
                )
            }
        </div>
    );
}

export function applySubComponents<
    T extends typeof GameListBase
>(C: T) {
    return Object.assign(C, {});
}

export default applySubComponents(GameListBase);