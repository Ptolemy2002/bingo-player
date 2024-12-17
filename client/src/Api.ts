import axios, { AxiosInstance, CreateAxiosDefaults } from "axios";
import getEnv from "src/Env";

export let Api: AxiosInstance | null = null;

export default function getApi(options: CreateAxiosDefaults={}, createNew=false): AxiosInstance {
    if (!createNew && Api) {
        return Api;
    }

    const env = getEnv();
    Api = axios.create({
        withCredentials: true,
        ...options,
        baseURL: env.isProd ? env.prodApiUrl! : env.devApiUrl
    });

    return Api;
}