import swaggerAutogen from "swagger-autogen";
import getEnv from "../env";
import { stripWords } from "@ptolemy2002/js-utils";
import SpaceModel from "models/SpaceModel";
const env = getEnv();

const outputFile = './swagger_output.json';
const endpointFiles = ['src/routes/index.ts', 'src/routes/api/v1/index.ts'];

const baseUrl = stripWords(
	env.apiURL, "/",
	/^https?:\/\//.test(env.apiURL) ? 2 : 0,
	/\/api\/v\d+$/.test(env.apiURL) ? 2 : 0
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

	components: {
		schemas: {
			Space: {
				$id: "abc123",
				$name: "My Space",
				description: "This is a space",
				examples: ["Example 1", "Example 2"],
				aliases: ["Alias 1", "Alias 2"],
				tags: ["tag-1", "tag-2"]
			},

			CleanSpace: {
				$id: "abc123",
				$name: "My Space",
				$description: "This is a space",
				$examples: ["Example 1", "Example 2"],
				$aliases: ["Alias 1", "Alias 2"],
				$tags: ["tag-1", "tag-2"]
			},

			MongoSpace: {
				$_id: "abc123",
				$name: "My Space",
				description: "This is a space",
				examples: ["Example 1", "Example 2"],
				aliases: ["Alias 1", "Alias 2"],
				tags: ["tag-1", "tag-2"]
			},

			CleanMongoSpace: {
				$_id: "abc123",
				$name: "My Space",
				$description: "This is a space",
				$examples: ["Example 1", "Example 2"],
				$aliases: ["Alias 1", "Alias 2"],
				$tags: ["tag-1", "tag-2"]
			},

			SpaceQueryProp: {
				"@enum": [
					"id",
					"name",
					"description",
					"examples",
					"aliases",
					"tags",
					"_id",
					"known-as",
					"alias",
					"tag",
					"example"
				]
			},

			ErrorCode: {
				"@enum": [
					"UNKNOWN",
					"BAD_INPUT",
					"INTERNAL",
					"NOT_FOUND",
					"NOT_IMPLEMENTED"
				]
			},

			ErrorResponse: {
				$ok: false,
				// Code is either an error code or null
				$code: {
					$ref: "#/components/schemas/ErrorCode"
				},
				$message: "An error message. Can also be an array of messages or null.",
				help: "https://example.com/docs"
			}
		}
	}
};

export default swaggerAutogen({openapi: "3.0.0"})(outputFile, endpointFiles, doc);