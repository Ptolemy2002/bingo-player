import { registerSocketConsumer } from "services/socket";
import pingSocketConsumer from "./ping";
import { SocketGameCreateEventName, SocketPingEventName } from "shared";
import { gameCreateSocketConsumer } from "./game";

registerSocketConsumer(SocketPingEventName, pingSocketConsumer);
registerSocketConsumer(SocketGameCreateEventName, gameCreateSocketConsumer);