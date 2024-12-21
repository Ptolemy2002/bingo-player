import swaggerAutogen from "swagger-autogen";
import getEnv from "../env";
import { stripWords } from "@ptolemy2002/js-utils";
const env = getEnv();

const outputFile = './swagger_output.json';
const endpointFiles = ['src/routes/index.ts'];

if (!env.apiURL) throw new Error("API URL for production is not defined in the environment variables");
const baseUrl = stripWords(
	env.apiURL, "/",
	/^https?:\/\//.test(env.apiURL) ? 2 : 0,
	env.apiURL.endsWith("/api/v1") ? 2 : 0
);
console.log("Detected Swagger Base URL:", baseUrl);

const doc = {
	info: {
		version: "1.0.0",
		title: "Bingo Player API",
		description: "Documentation of the Bingo Player API",
	},
    host: baseUrl,
	schemes: [env.isProd ? "https" : "http"],
	consumes: ["application/json"],
	produces: ["application/json"],

	definitions: {
		
	}
};

export default swaggerAutogen()(outputFile, endpointFiles, doc);