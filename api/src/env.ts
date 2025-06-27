import { z, ZodString, ZodLiteral, ZodNull, ZodUnion } from 'zod';
import dotEnv from 'dotenv';
import { stripWords } from '@ptolemy2002/js-utils';
dotEnv.config();

function nullableUrl(defaultValue?: string | null, emptyIsDefault = true) {
    const urlType = z.string().trim().url();
    const nullType = z.null();

    let result: ZodUnion<
        [ZodString, ZodLiteral<"">, ZodNull]
    > | ZodUnion<[ZodString, ZodNull]> = z.union([urlType, nullType]);;
    if (emptyIsDefault) {
        result = z.union([urlType, z.literal(""), nullType]);
    }

    if (defaultValue !== undefined) {
        return result
            .transform(value => emptyIsDefault && value === "" ? defaultValue : value)
            .optional()
            .default(defaultValue);
    }

    return result;
}


function url(defaultValue?: string, emptyIsDefault = true) {
    const urlType = z.string().trim().url();

    let result: ZodString | ZodUnion<[ZodString, ZodLiteral<"">]> = urlType;
    if (emptyIsDefault) {
        result = z.union([urlType, z.literal("")]);
    }

    if (defaultValue !== undefined) {
        return result
            .transform(value => emptyIsDefault && value === "" ? defaultValue : value)
            .default(defaultValue);
    }

    return result;
}

export const EnvSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number()
        .int({message: "PORT must be an integer"})
        .positive({message: "PORT must be positive"})
        .default(8080),
    SOCKET_PORT: z.coerce.number()
        .int({message: "SOCKET_PORT must be an integer"})
        .positive({message: "SOCKET_PORT must be positive"})
        .default(8081),
    DEV_API_URL: url("http://localhost:8080", false),
    PROD_API_URL: nullableUrl(null),
    DEV_CLIENT_URL: url("http://localhost:3000", false),
    PROD_CLIENT_URL: nullableUrl(null),
    MONGO_CONNECTION_STRING: z.string().url(),  
    
    // Additional environment variables here
});

export type EnvType = {
    nodeEnv: "development" | "production" | "test",
    isProd: boolean,
    isDev: boolean,
    isTest: boolean,
    port: number,
    socketPort: number,
    devApiUrl: string,
    prodApiUrl: string | null,
    devClientUrl: string,
    prodClientUrl: string | null,
    apiURL: string,
    clientURL: string,
    getDocsURL: (version: number) => string,
    mongoConnectionString: string,

    // Additional environment variables here
};
let Env: z.infer<typeof EnvSchema> | null = null;
let EnvInstance: EnvType | null = null;

export default function getEnv(createNew=false): EnvType {
    if (createNew || Env === null) Env = EnvSchema.parse(process.env);
    if (createNew || !EnvInstance) {
        if (Env.NODE_ENV === "production") {
            if (!Env.PROD_API_URL) throw new Error("PROD_API_URL is required in production environment");
            if (!Env.PROD_CLIENT_URL) throw new Error("PROD_CLIENT_URL is required in production environment");
        }

        const apiURL = Env.NODE_ENV === "production" ? Env.PROD_API_URL! : Env.DEV_API_URL;
        const clientURL = Env.NODE_ENV === "production" ? Env.PROD_CLIENT_URL! : Env.DEV_CLIENT_URL;

        EnvInstance = Object.freeze({
            port: Env.PORT,
            socketPort: Env.SOCKET_PORT,
            nodeEnv: Env.NODE_ENV,
            isProd: Env.NODE_ENV === "production",
            isDev: Env.NODE_ENV === "development",
            isTest: Env.NODE_ENV === "test",
            devApiUrl: Env.DEV_API_URL,
            prodApiUrl: Env.PROD_API_URL,
            devClientUrl: Env.DEV_CLIENT_URL,
            prodClientUrl: Env.PROD_CLIENT_URL,
            apiURL,
            clientURL,
            getDocsURL: (v) => (/\/api\/v\d+$/.test(apiURL) ? stripWords(apiURL, "/", 0, 2) : apiURL) + `/api/v${v}/docs`,
            mongoConnectionString: Env.MONGO_CONNECTION_STRING
        });
    }

    return EnvInstance;
}