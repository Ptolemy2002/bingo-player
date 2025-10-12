import { GameCreateFieldProps } from "./Types";
import useManualErrorHandling from "@ptolemy2002/react-manual-error-handling";
import clsx from "clsx";
import StyledButton from "src/components/StyledButton";
import { useBingoGameCollectionContext } from "src/context/BingoGameCollection";
import getSocket from "src/Socket";
import { usePersistentState } from "@ptolemy2002/react-utils";
import { Form } from "react-bootstrap";
import { useState } from "react";

function GameCreateFieldBase({
    className,
    onClick,
    ...props
}: GameCreateFieldProps["all"]) {
    const [gc, setGC] = useBingoGameCollectionContext();
    const [name] = usePersistentState("bingoPlayerApp.name", "");
    const [gameName, setGameName] = useState("New Game");
    const [loading, setLoading] = useState(false);

    const socket = getSocket();
    const { _try } = useManualErrorHandling();

    const gameExists = gc.hasGame(gameName);

    return (
        <Form className={clsx("game-create-form", className)} {...props}>
            <Form.Control
                name="gameName"
                className="game-create-field"
                type="text"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                placeholder="Enter new game name"
            />
            
            <StyledButton
                $variant="createGame"
                className="game-create-button"
                onClick={(e) => _try(async () => {
                    setLoading(true);
                    const res = await socket.emitSafeWithAck("gameCreate", { id: gameName, hostName: name });
                    
                    const ngc = gc.clone();
                    ngc.addOrUpdateGame(res.game);
                    setGC(ngc);

                    setGameName("");
                    onClick?.(gameName, e);
                    setLoading(false);
                })}
                disabled={loading || gameExists}
            >
                {loading ? "Creating Game..." : gameExists ? "Name Taken" : "Create Game"}
            </StyledButton>
        </Form>
    );
}

export function applySubComponents<
    T extends typeof GameCreateFieldBase
>(C: T) {
    return Object.assign(C, {
    });
}

export default applySubComponents(GameCreateFieldBase);