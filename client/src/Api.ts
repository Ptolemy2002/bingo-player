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

export let Api: AxiosCacheInstance | null = null;

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
    ]
>;

export default function getApi(
    options: CreateAxiosDefaults = {},
    cacheOptions: CacheOptions = {
        ttl: minutesToMilliseconds(5),
    },
    createNew = false,
): Override<AxiosCacheInstance, TypedAxios<ApiRoutes>> {
    if (!createNew && Api) {
        return Api;
    }

    const env = getEnv();
    Api = setupCache(
        axios.create({
            withCredentials: true,
            ...options,
            baseURL: env.apiURL + '/api/v1',
        }),
        cacheOptions,
    );

    return Api;
}