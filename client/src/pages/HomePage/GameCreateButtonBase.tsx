import { useSuspenseController } from "@ptolemy2002/react-suspense";
import { GameCreateButtonProps } from "./Types";
import clsx from "clsx";
import StyledButton from "src/components/StyledButton";
import { useBingoGameCollectionContext } from "src/context/BingoGameCollection";
import useManualErrorHandling from "@ptolemy2002/react-manual-error-handling";
import getSocket from "src/Socket";
import { usePersistentState } from "@ptolemy2002/react-utils";

function GameCreateButtonBase({
    className,
    ...props
}: GameCreateButtonProps["all"]) {
    const [, setGC] = useBingoGameCollectionContext();
    const [name] = usePersistentState("bingoPlayerApp.name", "");
    const [{suspend}] = useSuspenseController();
    const { _try } = useManualErrorHandling();
    const socket = getSocket();

    return (
        <StyledButton
            $variant="createGame"
            className={clsx("game-create-button", className)}
            onClick={() => _try(() => suspend(async () => {
                const res = await socket.emitSafeWithAck("gameCreate", { id: "New Game", hostName: name });
                setGC(gc => {
                    const ngc = gc.clone();
                    ngc.addOrUpdateGame(res.game);
                    return ngc;
                })
            }))}
            {...props}
        >
            Create Game
        </StyledButton>
    );
}

export function applySubComponents<
    T extends typeof GameCreateButtonBase
>(C: T) {
    return Object.assign(C, {
    });
}

export default applySubComponents(GameCreateButtonBase);