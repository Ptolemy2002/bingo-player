import swaggerAutogen from 'swagger-autogen';
import getEnv from '../env';
import { stripWords } from '@ptolemy2002/js-utils';
import {
    SwaggerCleanMongoSpaceSchema,
    SwaggerCleanSpaceSchema,
    SwaggerErrorCodeSchema,
    SwaggerErrorResponseSchema,
    SwaggerMongoSpaceSchema,
    SwaggerSpaceQueryPropNonIdSchema,
    SwaggerSpaceQueryPropSchema,
    SwaggerSpaceSchema
} from 'shared';
const env = getEnv();

const outputFile = './swagger_output.json';
const endpointFiles = ['src/routes/index.ts', 'src/routes/api/v1/index.ts'];

const baseUrl = stripWords(
    env.apiURL,
    '/',
    /^https?:\/\//.test(env.apiURL) ? 2 : 0,
    /\/api\/v\d+$/.test(env.apiURL) ? 2 : 0,
);
console.log('Detected Swagger Base URL:', baseUrl);

const doc = {
    info: {
        version: '1.0.0',
        title: 'Bingo Player API',
        description: 'Documentation of the Bingo Player API',
    },
    host: baseUrl,
    schemes: [env.isProd ? 'https' : 'http'],
    consumes: ['application/json'],
    produces: ['application/json'],

    components: {
        schemas: {
            Space: SwaggerSpaceSchema,
            CleanSpace: SwaggerCleanSpaceSchema,
            MongoSpace: SwaggerMongoSpaceSchema,
            CleanMongoSpace: SwaggerCleanMongoSpaceSchema,
            SpaceQueryProp: SwaggerSpaceQueryPropSchema,
            SpaceQueryPropNonId: SwaggerSpaceQueryPropNonIdSchema,
            ErrorCode: SwaggerErrorCodeSchema
        },

        "@schemas": {
            NullableStringArray: {
                type: 'array',
                items: {
                    oneOf: [
                        { type: 'string' },
                        { type: 'null' },
                    ]
                }
            },
            ErrorResponse: SwaggerErrorResponseSchema
        }
    },
};

export default swaggerAutogen({ openapi: '3.1.1' })(
    outputFile,
    endpointFiles,
    doc,
);
