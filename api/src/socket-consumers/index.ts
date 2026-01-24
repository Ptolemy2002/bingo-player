import { registerSocketConsumer } from "services/socket";
import pingSocketConsumer from "./ping";
import idSocketConsumer from "./id";
import { SocketGameCreateEventName, SocketGameGetEventName, SocketGameJoinEventName, SocketGameLeaveEventName, SocketGameListEventName, SocketPingEventName, SocketIDEventName, SocketSpaceOpEventName, SocketBoardOpEventName, SocketBoardTemplateOpEventName, SocketSpaceFillEventName } from "shared";
import { gameCreateSocketConsumer, gameGetSocketConsumer, gameJoinSocketConsumer, gameLeaveSocketConsumer, gameListSocketConsumer } from "./game";
import { spaceFillSocketConsumer, spaceOpSocketConsumer } from "./space";
import { boardOpSocketConsumer } from "./board";
import { boardTemplateOpSocketConsumer } from "./board-template";

registerSocketConsumer(SocketPingEventName, pingSocketConsumer);
registerSocketConsumer(SocketIDEventName, idSocketConsumer);

registerSocketConsumer(SocketGameCreateEventName, gameCreateSocketConsumer);
registerSocketConsumer(SocketGameJoinEventName, gameJoinSocketConsumer);
registerSocketConsumer(SocketGameLeaveEventName, gameLeaveSocketConsumer);
registerSocketConsumer(SocketGameGetEventName, gameGetSocketConsumer);
registerSocketConsumer(SocketGameListEventName, gameListSocketConsumer);

registerSocketConsumer(SocketSpaceOpEventName, spaceOpSocketConsumer);
registerSocketConsumer(SocketBoardOpEventName, boardOpSocketConsumer);
registerSocketConsumer(SocketBoardTemplateOpEventName, boardTemplateOpSocketConsumer);

registerSocketConsumer(SocketSpaceFillEventName, spaceFillSocketConsumer);