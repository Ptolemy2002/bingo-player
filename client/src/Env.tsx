import { z, ZodLiteral, ZodNull, ZodString, ZodUnion } from 'zod';
import { createContext, useContext } from 'react';

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
    VITE_DEV_API_URL: url("http://localhost:8080", false),
    VITE_PROD_API_URL: nullableUrl(null),
    VITE_DEV_CLIENT_URL: url("http://localhost:3000"),
    VITE_PROD_CLIENT_URL: nullableUrl(null),
    VITE_DEV_SOCKET_URL: url("http://localhost:8081", false),
    VITE_PROD_SOCKET_URL: nullableUrl(null),

    // Additional environment variables here
});

export type EnvType = {
    nodeEnv: "development" | "production" | "test",
    isProd: boolean,
    isDev: boolean,
    isTest: boolean,
    devApiUrl: string,
    prodApiUrl: string | null,
    devClientUrl: string,
    prodClientUrl: string | null,
    apiURL: string,
    clientURL: string,
    devSocketUrl: string,
    prodSocketUrl: string | null,
    socketUrl: string,

    // Additional environment variables here
};
let Env: z.infer<typeof EnvSchema> | null = null;
let EnvInstance: EnvType | null = null;

export default function getEnv(createNew=false): EnvType {
    if (createNew || Env === null) Env = EnvSchema.parse(import.meta.env);
    if (createNew || !EnvInstance) {
        if (Env.NODE_ENV === "production") {
            if (!Env.VITE_PROD_API_URL) throw new Error("PROD_API_URL is required in production environment");
            if (!Env.VITE_PROD_CLIENT_URL) throw new Error("PROD_CLIENT_URL is required in production environment");
            if (!Env.VITE_PROD_SOCKET_URL) throw new Error("PROD_SOCKET_URL is required in production environment");
        }

        EnvInstance = Object.freeze({
            nodeEnv: Env.NODE_ENV,
            isProd: Env.NODE_ENV === "production",
            isDev: Env.NODE_ENV === "development",
            isTest: Env.NODE_ENV === "test",
            devApiUrl: Env.VITE_DEV_API_URL,
            prodApiUrl: Env.VITE_PROD_API_URL,
            devClientUrl: Env.VITE_DEV_CLIENT_URL,
            prodClientUrl: Env.VITE_PROD_CLIENT_URL,
            apiURL: Env.NODE_ENV === "production" ? Env.VITE_PROD_API_URL! : Env.VITE_DEV_API_URL,
            clientURL: Env.NODE_ENV === "production" ? Env.VITE_PROD_CLIENT_URL! : Env.VITE_DEV_CLIENT_URL,
            devSocketUrl: Env.VITE_DEV_SOCKET_URL,
            prodSocketUrl: Env.VITE_PROD_SOCKET_URL,
            socketUrl: Env.NODE_ENV === "production" ? Env.VITE_PROD_SOCKET_URL! : Env.VITE_DEV_SOCKET_URL,
        });
    }

    return EnvInstance;
}

export const EnvContext = createContext<EnvType | undefined>(undefined);

export function EnvProvider({ children }: { children: React.ReactNode }) {
    const env = getEnv();
    return <EnvContext.Provider value={env}>{children}</EnvContext.Provider>;
}

export function useEnv() {
    const env = useContext(EnvContext);
    if (env === undefined) throw new Error("EnvProvider not found");
    return env;
}