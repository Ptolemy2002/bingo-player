import { registerSocketConsumer } from "services/socket";
import pingSocketConsumer from "./ping";

registerSocketConsumer("ping", pingSocketConsumer);