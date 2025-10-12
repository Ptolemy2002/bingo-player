import { useSuspenseController } from "@ptolemy2002/react-suspense";
import { GameCreateFieldProps } from "./Types";
import clsx from "clsx";
import StyledButton from "src/components/StyledButton";
import { useBingoGameCollectionContext } from "src/context/BingoGameCollection";
import useManualErrorHandling from "@ptolemy2002/react-manual-error-handling";
import getSocket from "src/Socket";
import { usePersistentState } from "@ptolemy2002/react-utils";
import { Form } from "react-bootstrap";
import { useState } from "react";

function GameCreateFieldBase({
    className,
    ...props
}: GameCreateFieldProps["all"]) {
    const [, setGC] = useBingoGameCollectionContext();
    const [name] = usePersistentState("bingoPlayerApp.name", "");
    const [gameName, setGameName] = useState("New Game");
    const [loading, setLoading] = useState(false);

    const [{suspend}] = useSuspenseController();
    const { _try } = useManualErrorHandling();
    const socket = getSocket();

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
                onClick={() => _try(() => suspend(async () => {
                    setLoading(true);
                    const res = await socket.emitSafeWithAck("gameCreate", { id: gameName, hostName: name });
                    setGC(gc => {
                        const ngc = gc.clone();
                        ngc.addOrUpdateGame(res.game);
                        return ngc;
                    });
                    setLoading(false);
                }))}
                disabled={loading}
            >
                {loading ? "Creating..." : "Create Game"}
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