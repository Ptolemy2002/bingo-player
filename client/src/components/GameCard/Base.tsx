import { GameCardProps } from "./Types";
import { Card } from "react-bootstrap";
import clsx from "clsx";
import { listInPlainEnglish } from "@ptolemy2002/js-utils";
import { useMemo } from "react";
import { BingoGameData } from "shared";
import { LinkContainer } from "react-router-bootstrap";
import StyledButton from "src/components/StyledButton";

function GameCardBase({
    className,
    game: _game,
    showViewLink = true,
    showJoinLink = false,
    showSpectateLink = false,
    onJoin,
    loading=false,
    ...props
}: GameCardProps["functional"]) {
    const game = new BingoGameData(_game)

    const playerNameList = useMemo(() => {
        if (game.players.length === 0) return null;

        return listInPlainEnglish(
            game.players.map((p) => p.name), {max: 5, conjunction: "and"}
        )
    }, [game.players])

    return (
        <Card className={clsx("game-card", className)} {...props}>
            <Card.Body>
                <Card.Title>{game.id}</Card.Title>
                <Card.Subtitle>{game.players.length} Player(s)</Card.Subtitle>

                <Card.Text as="div">
                    {playerNameList}
                    <br />

                    <b>Spaces Involved:</b> {game.spaces.length} <br />
                    <b>Boards Involved:</b> {game.boards.length}
                </Card.Text>

                <div className="btn-col">
                    {loading && <StyledButton $variant="gameCardLoading" disabled>
                        Loading...
                    </StyledButton>}

                    {showViewLink && <LinkContainer to={`/game/${encodeURIComponent(game.id)}`}>
                        <StyledButton $variant="enterGame" disabled={loading}>
                            View Game
                        </StyledButton>
                    </LinkContainer>}

                    {showJoinLink && <StyledButton
                        $variant="joinGame"
                        onClick={() => onJoin?.("player")}
                        disabled={loading}
                    >
                        Join Game
                    </StyledButton>}

                    {showSpectateLink && <StyledButton
                        $variant="spectateGame"
                        onClick={() => onJoin?.("spectator")}
                        disabled={loading}
                    >
                        Spectate Game
                    </StyledButton>}
                </div>
            </Card.Body>
        </Card>
    )
}

export function applySubComponents<
    T extends typeof GameCardBase
>(C: T) {
    return Object.assign(C, {});
}

export default applySubComponents(GameCardBase);