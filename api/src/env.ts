import { z, ZodString, ZodLiteral, ZodNull, ZodUnion } from 'zod';
import dotEnv from 'dotenv';
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
    DEV_API_URL: url("http://localhost:8080", false),
    PROD_API_URL: nullableUrl(null),
    DEV_CLIENT_URL: url("http://localhost:3000", false),
    PROD_CLIENT_URL: nullableUrl(null),
    
    // Additional environment variables here
});

export type EnvType = {
    nodeEnv: "development" | "production" | "test",
    isProd: boolean,
    isDev: boolean,
    isTest: boolean,
    port: number,
    devApiUrl: string,
    prodApiUrl: string | null,
    devClientUrl: string,
    prodClientUrl: string | null,

    // Additional environment variables here
};
let Env: z.infer<typeof EnvSchema> | null = null;
let EnvInstance: EnvType | null = null;

export default function getEnv(createNew=false): EnvType {
    if (createNew || Env === null) Env = EnvSchema.parse(process.env);
    if (createNew || !EnvInstance) {
        EnvInstance = Object.freeze({
            port: Env.PORT,
            nodeEnv: Env.NODE_ENV,
            isProd: Env.NODE_ENV === "production",
            isDev: Env.NODE_ENV === "development",
            isTest: Env.NODE_ENV === "test",
            devApiUrl: Env.DEV_API_URL,
            prodApiUrl: Env.PROD_API_URL,
            devClientUrl: Env.DEV_CLIENT_URL,
            prodClientUrl: Env.PROD_CLIENT_URL
        });
    }

    return EnvInstance;
}