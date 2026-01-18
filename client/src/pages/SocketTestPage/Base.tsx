import { SocketTestPageProps } from "./Types";
import getSocket from "src/Socket";
import { useCallback, useEffect, useState } from "react";
import JSON5 from "json5";

function SocketTestPageBase({
    className
}: SocketTestPageProps["functional"]) {
    const socket = getSocket({ key: "test", debug: true });

    const [isConnected, setIsConnected] = useState(socket.connected);
    const [activityLog, setActivityLog] = useState<string[]>([]);

    const [userInput, setUserInput] = useState<unknown>({});
    const [socketEvent, setSocketEvent] = useState<string>("");
    const [socketOut, setSocketOut] = useState<unknown>(null);

    const [parseError, setParseError] = useState<string | null>(null);
    const [socketError, setSocketError] = useState<string | null>(null);

    const addLogEntry = useCallback((entry: string) => {
        // Get current timestamp
        const timestamp = new Date().toLocaleTimeString();
        entry = `[${timestamp}] ${entry}`;
        setActivityLog(log => [...log, entry]);
    }, []);

    useEffect(() => {
        function onConnect() {
            addLogEntry("Socket connected.");
            setIsConnected(true);
        }

        function onDisconnect() {
            addLogEntry("Socket disconnected.");
            setIsConnected(false);
        }

        function onAnyOutgoing(event: string, ...args: unknown[]) {
            addLogEntry(`Emit Event: ${event} | Args: ${JSON.stringify(args)}`);
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.onAnyOutgoing(onAnyOutgoing);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.offAnyOutgoing(onAnyOutgoing);
        };
    }, [socket, addLogEntry]);

    return (
        <div id="socket-test-page" className={className}>
            <p>Connection status: {isConnected ? "Connected" : "Disconnected"}</p>
            <p>Socket ID: {socket.id ?? "N/A"}</p>

            <p>Activity Log:</p>
            <ul>
                {activityLog.map((entry, index) => (
                    <li key={index}>{entry}</li>
                ))}
            </ul>

            <input type="text"
                value={socketEvent}
                onChange={(e) => setSocketEvent(e.target.value)}
                placeholder="Socket Event Name"
            />
            
            <br /> <br />

            <textarea
                placeholder="Input Data"
                onKeyDown={(e) => {
                    // Override default tab behavior to insert spaces
                    if (e.key === "Tab") {
                        e.preventDefault();
                        const target = e.target as HTMLTextAreaElement;
                        const start = target.selectionStart;
                        const end = target.selectionEnd;

                        // Set textarea value to: text before caret + tab + text after caret
                        target.value = target.value.substring(0, start) + "    " + target.value.substring(end);

                        // Put caret at right position again
                        target.selectionStart = target.selectionEnd = start + 4;
                    }
                }}
                onChange={(e) => {
                    const input = e.target.value;
                    try {
                        const parsed = JSON5.parse(input);
                        setUserInput(parsed);
                        setParseError(null);
                    } catch (err) {
                        if (input.trim() !== "") {
                            console.error("Failed to parse user input as JSON5:", err);
                            setParseError((err instanceof Error ? err.message : String(err)));
                        }
                    }
                }}
            />
            <pre>{parseError ?? JSON.stringify(userInput, null, 2)}</pre>
            
            <br /> <br />

            <button
                onClick={async () => {
                    setSocketOut(null);
                    setSocketError(null);

                    try {
                        if (userInput && Object.keys(userInput).length > 0) {
                            // @ts-expect-error TS2345. Typing isn't necessary here. This is a developer tool.
                            const res = await socket.emitSafeWithAck(socketEvent, userInput);
                            addLogEntry(`Response for event "${socketEvent}": ${JSON.stringify(res)}`);
                            setSocketOut(res);
                        } else {
                            // @ts-expect-error TS2345. Typing isn't necessary here. This is a developer tool.
                            const res = await socket.emitSafeWithAck(socketEvent, {});
                            addLogEntry(`Response for event "${socketEvent}": ${JSON.stringify(res)}`);
                            setSocketOut(res);
                        }
                    } catch (err) {
                        console.error("Socket emit error:", err);
                        addLogEntry(`Socket Error for event "${socketEvent}": ${err instanceof Error ? err.message : String(err)}`);
                        setSocketError(err instanceof Error ? err.message : String(err));
                    }
                }}
                disabled={!!parseError || socketEvent.trim() === ""}
            >
                Emit Event
            </button>

            {socketError && (
                <p className="error">Socket Error: {socketError}</p>
            )}

            {socketOut ? (
                <pre>{JSON.stringify(socketOut, null, 2)}</pre>
            ) : null}
        </div>
    );
}

export function applySubComponents<
    T extends typeof SocketTestPageBase
>(C: T) {
    return Object.assign(C, {});
}

export default applySubComponents(SocketTestPageBase);