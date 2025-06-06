import axios, { CreateAxiosDefaults } from 'axios';
import { TypedAxios, RouteDef } from 'typed-axios-instance';
import {
    CountSpacesByPropQueryParamsInput,
    CountSpacesByPropResponseBody,
    CountSpacesByPropURLParams,
    CountSpacesResponseBody,
    GetSpaceByExactIDResponseBody,
    GetSpaceByExactIDURLParams,
    GetSpacesByPropQueryParamsInput,
    GetSpacesByPropResponseBody,
    GetSpacesByPropURLParams,
    GetSpacesQueryParamsInput,
    GetSpacesResponseBody,
    ListSpacePropQueryParamsInput,
    ListSpacePropResponseBody,
    ListSpacePropURLParams,
    SearchSpacesCountResponseBody,
    SearchSpacesCountURLParams,
    SearchSpacesQueryParamsInput,
    SearchSpacesResponseBody,
    SearchSpacesURLParams,
} from 'shared';
import getEnv from 'src/Env';
import { setupCache, CacheOptions, AxiosCacheInstance } from 'axios-cache-interceptor';
import { minutesToMilliseconds } from 'date-fns';
import { Override } from "@ptolemy2002/ts-utils";

export const ApiInstances: Record<string, AxiosCacheInstance> = {};

// This is just a wrapper to ensure that ApiRoutes is an array of RouteDefs.
// TypeScript will error if it is not.
type RouteDefArray<T extends RouteDef[]> = T;
export type ApiRoutes = RouteDefArray<
    [
        {
            route: `/spaces/get/by-id/${GetSpaceByExactIDURLParams['id']}`;
            method: 'GET';

            jsonResponse: GetSpaceByExactIDResponseBody;
        },

        {
            route: `/spaces/get/by-prop/${GetSpacesByPropURLParams['prop']}/${GetSpacesByPropURLParams['query']}`;
            method: 'GET';

            queryParams: GetSpacesByPropQueryParamsInput;
            jsonResponse: GetSpacesByPropResponseBody;
        },

        {
            route: `/spaces/count/by-prop/${CountSpacesByPropURLParams['prop']}/${CountSpacesByPropURLParams['query']}`;
            method: 'GET';

            queryParams: CountSpacesByPropQueryParamsInput;
            jsonResponse: CountSpacesByPropResponseBody;
        },

        {
            route: '/spaces/get/all';
            method: 'GET';

            queryParams: GetSpacesQueryParamsInput;
            jsonResponse: GetSpacesResponseBody;
        },

        {
            route: '/spaces/count/all';
            method: 'GET';
            queryParams: {};
            jsonResponse: CountSpacesResponseBody;
        },

        {
            route: `/spaces/search/${SearchSpacesURLParams['query']}`;
            method: 'GET';
            queryParams: SearchSpacesQueryParamsInput;
            jsonResponse: SearchSpacesResponseBody;
        },

        {
            route: `/spaces/search/${SearchSpacesCountURLParams['query']}/count`;
            method: 'GET';
            queryParams: {};
            jsonResponse: SearchSpacesCountResponseBody;
        },

        {
            route: `/spaces/get/all/list/${ListSpacePropURLParams['prop']}`;
            method: 'GET';
            queryParams: ListSpacePropQueryParamsInput;
            jsonResponse: ListSpacePropResponseBody;
        }
    ]
>;

export const RouteIds = {
    getSpaceByID: "/spaces/get/by-id/:id",
    getSpacesByProp: "/spaces/get/by-prop/:prop/:query",
    countSpacesByProp: "/spaces/count/by-prop/:prop/:query",
    getAllSpaces: "/spaces/get/all",
    countAllSpaces: "/spaces/count/all",
    searchSpaces: "/spaces/search/:query",
    searchSpacesCount: "/spaces/search/:query/count",
    listSpaceProp: "/spaces/get/all/list/:prop"
} as const;

export type GetAPIOptions = {
    key?: string,
    options?: Omit<CreateAxiosDefaults, "baseURL">,
    cacheOptions?: CacheOptions,
    createNew?: boolean
};

export default function getApi(
    {
        key="default",
        options,
        cacheOptions = {
            ttl: minutesToMilliseconds(5)
        },
        createNew = false
    }: GetAPIOptions = {}
): Override<AxiosCacheInstance, TypedAxios<ApiRoutes>> {
    const Api = ApiInstances[key];

    if (!createNew && Api) {
        return Api;
    }

    const env = getEnv();
    const result = setupCache(axios.create({
        withCredentials: true,
        ...options,
        baseURL: env.apiURL + "/api/v1"
    }), cacheOptions);

    ApiInstances[key] = result;
    return result;
}