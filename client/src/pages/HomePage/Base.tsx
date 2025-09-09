import { usePersistentState } from "@ptolemy2002/react-utils";
import DefaultNameField from "./NameFieldStyled";
import DefaultGameList from "./GameListBase";
import { HomePageProps } from "./Types";
import { SuspenseBoundary } from "@ptolemy2002/react-suspense";
import { useState } from "react";
import { SocketID } from "shared";
import getSocket from "src/Socket";

function HomePage({
    NameField = DefaultNameField,
    GameList = DefaultGameList
}: HomePageProps) {
    const [name] = usePersistentState("bingoPlayerApp.name", "");
    const [socketId, setSocketId] = useState<SocketID | null>(null);
    const socket = getSocket();

    return (
        <div id="home-page">
            <p>Welcome to Bingo Player! From here, you can enter games and play bingo.</p>
            <NameField />

            {
                name ? (
                    <SuspenseBoundary fallback={<p>Loading Game List...</p>} init={async () => {
                        const res = await socket.emitSafeWithAck("socketId");
                        setSocketId(res.id);
                    }}>
                        <h2>Your Games</h2>
                        <GameList socketId={socketId} category="mine" />

                        <h2>Other Games</h2>
                        <GameList socketId={socketId} category="not-mine" />
                    </SuspenseBoundary>
                ) : (
                    <p>Please enter your name to start viewing and joining games.</p>
                )
            }
        </div>
    );
}
export function applySubComponents<
    T extends typeof HomePage
>(C: T) {
    return Object.assign(C, {
        NameField: DefaultNameField,
    });
}

export default applySubComponents(HomePage);