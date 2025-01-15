import {
    OpenAPIRegistry,
    extendZodWithOpenApi
} from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);
console.log("zod has been extended with OpenAPI support");

export const swaggerRegistry = new OpenAPIRegistry();