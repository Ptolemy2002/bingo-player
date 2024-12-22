import swaggerAutogen from "swagger-autogen";
import getEnv from "../env";
import { stripWords } from "@ptolemy2002/js-utils";
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

	"@definitions": {
		Space: {
			type: "object",
			properties: {
				id: {
					type: "string"
				},
				name: {
					type: "string"
				},
				description: {
					type: "string"
				},
				examples: {
					type: "array",
					items: {
						type: "string"
					}
				},
				aliases: {
					type: "array",
					items: {
						type: "string"
					}
				},
				tags: {
					type: "array",
					items: {
						type: "string"
					}
				}
			},
			required: ["id", "name"]
		},

		CleanSpace: {
			type: "object",
			properties: {
				id: {
					type: "string"
				},
				name: {
					type: "string"
				},
				description: {
					type: "string"
				},
				examples: {
					type: "array",
					items: {
						type: "string"
					}
				},
				aliases: {
					type: "array",
					items: {
						type: "string"
					}
				},
				tags: {
					type: "array",
					items: {
						type: "string"
					}
				}
			},
			required: ["id", "name", "description", "examples", "aliases", "tags"]
		},

		MongoSpace: {
			type: "object",
			properties: {
				_id: {
					type: "string"
				},
				name: {
					type: "string"
				},
				description: {
					type: "string"
				},
				examples: {
					type: "array",
					items: {
						type: "string"
					}
				},
				aliases: {
					type: "array",
					items: {
						type: "string"
					}
				},
				tags: {
					type: "array",
					items: {
						type: "string"
					}
				}
			},
			required: ["_id", "name"]
		},

		CleanMongoSpace: {
			type: "object",
			properties: {
				_id: {
					type: "string"
				},
				name: {
					type: "string"
				},
				description: {
					type: "string"
				},
				examples: {
					type: "array",
					items: {
						type: "string"
					}
				},
				aliases: {
					type: "array",
					items: {
						type: "string"
					}
				},
				tags: {
					type: "array",
					items: {
						type: "string"
					}
				}
			},
			required: ["_id", "name", "description", "examples", "aliases", "tags"]
		},

		ErrorCode: {
			type: "string",
			enum: [
				"UNKNOWN",
				"BAD_INPUT",
				"INTERNAL",
				"NOT_FOUND",
				"NOT_IMPLEMENTED"
			]
		},

		ErrorResponse: {
			type: "object",
			properties: {
				ok: {
					type: "boolean",
					enum: [false]
				},
				// Code is either an error code or null
				code: {
					$ref: "#/definitions/ErrorCode"
				},
				message: {
					type: "string"
				},
				help: {
					type: "string",
					required: false,
					description: "URL to the documentation"
				}
			}
		}
	}
};

export default swaggerAutogen()(outputFile, endpointFiles, doc);