import { registerSocketConsumer } from "services/socket";
import pingSocketConsumer from "./ping";
import idSocketConsumer from "./id";
import { SocketGameCreateEventName, SocketGameGetEventName, SocketGameJoinEventName, SocketGameLeaveEventName, SocketGameListEventName, SocketPingEventName, SocketIDEventName, SocketSpaceOpEventName } from "shared";
import { gameCreateSocketConsumer, gameGetSocketConsumer, gameJoinSocketConsumer, gameLeaveSocketConsumer, gameListSocketConsumer } from "./game";
import { spaceOpSocketConsumer } from "./space";

registerSocketConsumer(SocketPingEventName, pingSocketConsumer);
registerSocketConsumer(SocketIDEventName, idSocketConsumer);

registerSocketConsumer(SocketGameCreateEventName, gameCreateSocketConsumer);
registerSocketConsumer(SocketGameJoinEventName, gameJoinSocketConsumer);
registerSocketConsumer(SocketGameLeaveEventName, gameLeaveSocketConsumer);
registerSocketConsumer(SocketGameGetEventName, gameGetSocketConsumer);
registerSocketConsumer(SocketGameListEventName, gameListSocketConsumer);

registerSocketConsumer(SocketSpaceOpEventName, spaceOpSocketConsumer);