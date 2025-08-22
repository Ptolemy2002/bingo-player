import { registerSocketConsumer } from "services/socket";
import pingSocketConsumer from "./ping";
import { SocketGameCreateEventName, SocketGameGetEventName, SocketGameJoinEventName, SocketGameLeaveEventName, SocketPingEventName } from "shared";
import { gameCreateSocketConsumer, gameGetSocketConsumer, gameJoinSocketConsumer, gameLeaveSocketConsumer } from "./game";

registerSocketConsumer(SocketPingEventName, pingSocketConsumer);
registerSocketConsumer(SocketGameCreateEventName, gameCreateSocketConsumer);
registerSocketConsumer(SocketGameJoinEventName, gameJoinSocketConsumer);
registerSocketConsumer(SocketGameLeaveEventName, gameLeaveSocketConsumer);
registerSocketConsumer(SocketGameGetEventName, gameGetSocketConsumer);