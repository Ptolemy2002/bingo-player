import appModulePath from 'app-module-path';
console.log("Adding current directory to module path:", process.cwd());
appModulePath.addPath(process.cwd());

import ms from 'ms';
import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import expressRateLimit from 'express-rate-limit';
import cors from 'cors';
import { HttpError } from 'http-errors';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from 'services/swagger_output.json';
import mongoose from 'mongoose';

import getEnv from 'env';

const env = getEnv();

import "socketApp"; // Ensure socketApp is imported to start the socket server

import indexRouter from 'routes/index';
import { ZodErrorCodeSchema, ZodErrorMessageSchema, ZodHelpLinkSchema } from 'shared';

const app = express();

// Connect to MongoDB
mongoose.connect(env.mongoConnectionString)
    .then(() =>  console.log('Successfully connected to MongoDB'))
    .catch((err) => console.error("Error Connecting to MongoDB:", err));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

try {
    app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile, {explorer: true}));
    console.log("Swagger documentation is available at /api/v1/docs");
} catch (error) {
    console.error("Error loading Swagger documentation:", error);
}

if (env.isProd) {
    const limiter = expressRateLimit({
        windowMs: ms("5m"),
        max: 100, // Limit each IP to 100 requests per windowMs
        standardHeaders: true, // Return rate limit info in the "RateLimit-*" headers
        legacyHeaders: false // Disable the "X-RateLimit-*" headers
    });

    app.use(limiter);
}

app.use(cors({
    origin: env.isProd ?
        env.prodClientUrl! : env.devClientUrl,
    credentials: true
}));

app.use('/', indexRouter);

app.use(function(err: HttpError, req: Request, res: Response, next: NextFunction) {
    console.error(err.stack);

    let code = err.code ?? "UNKNOWN";
    const { success: codeSuccess } = ZodErrorCodeSchema.safeParse(code);

    let help = err.help ?? getEnv().getExpressDocsURL(1);
    const { success: helpSuccess } = ZodHelpLinkSchema.safeParse(help);

    let message = err.message ?? "Unknown error";
    const { success: messageSuccess } = ZodErrorMessageSchema.safeParse(message);

    if (!codeSuccess) {
        code = "UNKNOWN";
    }

    if (!helpSuccess) {
        help = getEnv().getExpressDocsURL(1);
    }

    if (!messageSuccess) {
        message = "Unknown error";
    }

    res.status(err.status ?? 500);
    res.json({ ok: false, code, message, help });
});

export default app;