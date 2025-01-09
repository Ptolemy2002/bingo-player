import axios, { AxiosInstance, CreateAxiosDefaults } from "axios";
import { TypedAxios, RouteDef } from "typed-axios-instance";
import { GetSpaceByExactIDResponseBody, GetSpaceByExactIDURLParams, GetSpacesByPropQueryParamsInput, GetSpacesByPropResponseBody, GetSpacesByPropURLParams } from "shared";
import getEnv from "src/Env";

export let Api: AxiosInstance | null = null;

// This is just a wrapper to ensure that ApiRoutes is an array of RouteDefs.
// TypeScript will error if it is not.
type RouteDefArray<T extends RouteDef[]> = T;
export type ApiRoutes = RouteDefArray<[
    {
        route: `/spaces/get/by-id/${GetSpaceByExactIDURLParams["id"]}`,
        method: "GET",

        jsonResponse: GetSpaceByExactIDResponseBody
    },

    {
        route: `/spaces/get/by-prop/${GetSpacesByPropURLParams["prop"]}/${GetSpacesByPropURLParams["query"]}`,
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