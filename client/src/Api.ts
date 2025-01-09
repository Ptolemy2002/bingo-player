import axios, { AxiosInstance, CreateAxiosDefaults } from "axios";
import { TypedAxios, RouteDef } from "typed-axios-instance";
import { GetSpaceByExactIDResponseBody, GetSpacesByPropQueryParamsInput, GetSpacesByPropResponseBody } from "shared";
import getEnv from "src/Env";

export let Api: AxiosInstance | null = null;

type RouteDefArray<T extends RouteDef[]> = T;

export type ApiRoutes = RouteDefArray<[
    {
        route: `/spaces/get/by-id/${string}`,
        method: "GET",

        jsonResponse: GetSpaceByExactIDResponseBody
    },

    {
        route: `/spaces/get/by-prop/${string}/${string}`,
        method: "GET",

        queryParams: GetSpacesByPropQueryParamsInput,
        jsonResponse: GetSpacesByPropResponseBody
    }
]>;

export default function getApi(options: CreateAxiosDefaults={}, createNew=false): TypedAxios<ApiRoutes> {
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