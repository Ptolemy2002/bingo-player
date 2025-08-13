// Registers all socket consumers
import "socket-consumers";
import { startSocket } from 'services/socket';
import express, { Response } from 'express';
import getEnv from "env";
import { getDocsHTML } from 'services/socketDocumentation';

const env = getEnv();
const socketApp = express();

socketApp.get('/', function(_, res) {
    res.send("Root route for Socket Server. For docs, go <a href='/docs'>here</a>.");
});

socketApp.get("/docs", (_, res: Response) => {
    res.send(getDocsHTML(false, ["bingoPing"]));
});

startSocket(env.socketPort, socketApp);
