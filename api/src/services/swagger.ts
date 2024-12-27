import swaggerAutogen from 'swagger-autogen';
import getEnv from '../env';
import { stripWords } from '@ptolemy2002/js-utils';
import {
    swaggerGenerator
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

const generatedSchemas = swaggerGenerator.generateComponents().components?.schemas ?? {};
const genetatedParameters = swaggerGenerator.generateComponents().components?.parameters ?? {};

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
        parameters: genetatedParameters,
        "@schemas": generatedSchemas
    },
};

export default swaggerAutogen({ openapi: '3.1.1' })(
    outputFile,
    endpointFiles,
    doc,
);
