import { registerSocketConsumer } from "services/socket";
import pingSocketConsumer from "./ping";
import { SocketGameCreateEventName, SocketGameJoinEventName, SocketGameLeaveEventName, SocketPingEventName } from "shared";
import { gameCreateSocketConsumer, gameJoinSocketConsumer, gameLeaveSocketConsumer } from "./game";

registerSocketConsumer(SocketPingEventName, pingSocketConsumer);
registerSocketConsumer(SocketGameCreateEventName, gameCreateSocketConsumer);
registerSocketConsumer(SocketGameJoinEventName, gameJoinSocketConsumer);
registerSocketConsumer(SocketGameLeaveEventName, gameLeaveSocketConsumer);