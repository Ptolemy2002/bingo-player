import { registerSocketConsumer } from "services/socket";
import pingSocketConsumer from "./ping";
import { SocketGameCreateEventName, SocketGameJoinEventName, SocketPingEventName } from "shared";
import { gameCreateSocketConsumer, gameJoinSocketConsumer } from "./game";

registerSocketConsumer(SocketPingEventName, pingSocketConsumer);
registerSocketConsumer(SocketGameCreateEventName, gameCreateSocketConsumer);
registerSocketConsumer(SocketGameJoinEventName, gameJoinSocketConsumer);