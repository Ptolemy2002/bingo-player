import clsx from "clsx";
import { GameListProps } from "./Types";
import { useSuspenseController } from "@ptolemy2002/react-suspense";
import useManualErrorHandling from "@ptolemy2002/react-manual-error-handling";
import { useEffect } from "react";
import { BingoGameCollection } from "shared";
import getSocket from "src/Socket";
import GameCard from "src/components/GameCard";
import { Col, Row } from "react-bootstrap";
import { useBingoGameCollectionContext } from "src/context/BingoGameCollection";
import { usePersistentState } from "@ptolemy2002/react-utils";

function GameListBase({
    className,
    category="all",
    colSizeXs=12,
    colSizeSm=12,
    colSizeMd=6,
    colSizeLg=4,
    colSizeXl=3,
    ...props
}: GameListProps["functional"]) {
    const [name] = usePersistentState("bingoPlayerApp.name", "");
    const [games, setGames] = useBingoGameCollectionContext();
    const [{suspend}] = useSuspenseController();
    const { _try } = useManualErrorHandling();
    const socket = getSocket();
    const socketId = socket.id ?? null;

    useEffect(() => {
        if (!socketId) {
            setGames([]);
            return;
        }

        _try(() => suspend(async () => {
            const res = await socket.emitSafeWithAck("gameList", { mine: category === "mine" });
            let gc = new BingoGameCollection(res.games);

            if (category === "not-mine") {
                gc = gc.filter(g => !g.hasPlayerBySocketId(socketId));
            }

            setGames(gc);
        }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category, socketId]);

    return (
        <div className={clsx("game-list", "card-container", className)} {...props}>
            {
                games.size() > 0 ? (
                    <Row>
                        {games.getAllGames().map((game) => (
                            <Col
                                key={game.id}
                                xs={colSizeXs}
                                sm={colSizeSm}
                                md={colSizeMd}
                                lg={colSizeLg}
                                xl={colSizeXl}
                            >
                                <GameCard
                                    game={game.toJSON()}
                                    showViewLink={game.hasPlayerBySocketId(socketId!)}
                                    showJoinLink={!game.hasPlayerBySocketId(socketId!)}
                                    onJoinClicked={() => _try(async () => {
                                        const res = await socket.emitSafeWithAck(
                                            "gameJoin",
                                            {
                                                id: game.id,
                                                playerName: name,
                                                playerRole: "player"
                                            }
                                        );
                                        
                                        // Make any necessary updates to the game in the collection
                                        game.fromJSON(res.game);

                                        const ngc = games.clone();
                                        ngc.addOrUpdateGame(game);
                                        setGames(ngc);
                                    })}
                                />
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