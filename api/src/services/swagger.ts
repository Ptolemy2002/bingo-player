import swaggerAutogen from "swagger-autogen";
import getEnv from "../env";
const env = getEnv();

const outputFile = './swagger_output.json';
const endpointFiles = ['src/routes/index.ts'];

const url = (
    (env.isProd && env.prodApiUrl) || env.devApiUrl
).split('://').slice(1).join('://');
const baseUrl = url.endsWith('/api/v1') ? url.slice(0, -7) : url;

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
		User: {
			id: 1,
		},
	}
};

export default swaggerAutogen()(outputFile, endpointFiles, doc);