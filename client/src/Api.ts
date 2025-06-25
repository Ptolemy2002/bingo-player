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
    UpdateSpaceByIDRequestBodyInput,
    UpdateSpaceByIDResponseBody,
    UpdateSpaceByIDURLParams,
    UpdateSpaceByNameURLParams,
    UpdateSpaceByNameRequestBodyInput,
    UpdateSpaceByNameResponseBody,
    DuplicateSpaceByIDURLParams,
    DuplicateSpaceByIDResponseBody,
    DuplicateSpaceByNameURLParams,
    DuplicateSpaceByNameResponseBody,
    DeleteSpaceByIDURLParams,
    DeleteSpaceByIDResponseBody,
    DeleteSpaceByNameURLParams,
    DeleteSpaceByNameResponseBody
} from 'shared';
import getEnv from 'src/Env';
import { setupCache, CacheOptions, AxiosCacheInstance, defaultKeyGenerator } from 'axios-cache-interceptor';
import { minutesToMilliseconds } from 'date-fns';
import { omit, Override } from "@ptolemy2002/ts-utils";

export const ApiInstances: Record<string, AxiosCacheInstance> = {};
export const ApiCacheManagerInstances: Record<string, ApiCacheManager> = {};

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
        },

        {
            route: `/spaces/update/by-id/${UpdateSpaceByIDURLParams['id']}`;
            method: 'POST';
            queryParams: {};
            jsonRequest: UpdateSpaceByIDRequestBodyInput;
            jsonResponse: UpdateSpaceByIDResponseBody;
        },

        {
            route: `/spaces/update/by-name/${UpdateSpaceByNameURLParams['name']}`;
            method: 'POST';
            queryParams: {};
            jsonRequest: UpdateSpaceByNameRequestBodyInput;
            jsonResponse: UpdateSpaceByNameResponseBody;
        },

        {
            route: `/spaces/duplicate/by-id/${DuplicateSpaceByIDURLParams['id']}`;
            method: 'POST';
            queryParams: {};
            jsonRequest: {};
            jsonResponse: DuplicateSpaceByIDResponseBody;
        },

        {
            route: `/spaces/duplicate/by-name/${DuplicateSpaceByNameURLParams['name']}`;
            method: 'POST';
            queryParams: {};
            jsonRequest: {};
            jsonResponse: DuplicateSpaceByNameResponseBody;
        },

        {
            route: `/spaces/delete/by-id/${DeleteSpaceByIDURLParams['id']}`;
            method: 'DELETE';
            queryParams: {};
            jsonRequest: {};
            jsonResponse: DeleteSpaceByIDResponseBody;
        },

        {
            route: `/spaces/delete/by-name/${DeleteSpaceByNameURLParams['name']}`;
            method: 'DELETE';
            queryParams: {};
            jsonRequest: {};
            jsonResponse: DeleteSpaceByNameResponseBody;
        }
    ]
>;

export const RouteTags = {
    getSpaceByID: "/spaces/get/by-id/:id",
    getSpacesByProp: "/spaces/get/by-prop/:prop/:query",
    countSpacesByProp: "/spaces/count/by-prop/:prop/:query",
    getAllSpaces: "/spaces/get/all",
    countAllSpaces: "/spaces/count/all",
    searchSpaces: "/spaces/search/:query",
    searchSpacesCount: "/spaces/search/:query/count",
    listSpaceProp: "/spaces/get/all/list/:prop",
    updateSpaceByID: "/spaces/update/by-id/:id",
    updateSpaceByName: "/spaces/update/by-name/:name",
    duplicateSpaceByID: "/spaces/duplicate/by-id/:id",
    duplicateSpaceByName: "/spaces/duplicate/by-name/:name",
    deleteSpaceByID: "/spaces/delete/by-id/:id",
    deleteSpaceByName: "/spaces/delete/by-name/:name"
} as const;

export type AxiosTypedCacheInstance = Override<AxiosCacheInstance, TypedAxios<ApiRoutes>>;

export class ApiCacheManager {
    requestIdsByTag: Record<string, string[]> = {};

    hasTag(tag: string): boolean {
        return (tag in this.requestIdsByTag) && this.requestIdsByTag[tag].length > 0;
    }

    initTag(tag: string) {
        if (!this.hasTag(tag)) {
            this.requestIdsByTag[tag] = [];
        }

        return this.requestIdsByTag[tag];
    }

    clearTag(tag: string): void {
        if (this.hasTag(tag)) {
            delete this.requestIdsByTag[tag];
        }
    }

    cleanTags(): void {
        for (const tag in this.requestIdsByTag) {
            if (this.requestIdsByTag[tag].length === 0) {
                this.clearTag(tag);
            }
        }
    }

    getIdsByTag(tag: string): string[] {
        this.initTag(tag);
        return this.requestIdsByTag[tag];
    }

    hasIdInTag(tag: string, requestId: string): boolean {
        if (!this.hasTag(tag)) return false;
        return this.getIdsByTag(tag).includes(requestId);
    }

    addId(tag: string, requestId: string): void {
        this.initTag(tag).push(requestId);
    }

    async removeFromTag(api: AxiosTypedCacheInstance, tag: string, requestId: string): Promise<void> {
        if (!this.hasIdInTag(tag, requestId)) return;
        await api.storage.remove(requestId);
        this.requestIdsByTag[tag] = this.requestIdsByTag[tag].filter(id => id !== requestId);
        this.cleanTags();
    }

    async removeByTag(api: AxiosTypedCacheInstance, tag: string): Promise<void> {
        if (!this.hasTag(tag)) return;

        const ids = this.getIdsByTag(tag);
        for (const id of ids) {
            await api.storage.remove(id);
        }

        this.clearTag(tag);
    }

}

export type GetAPIOptions = {
    key?: string,
    options?: Omit<CreateAxiosDefaults, "baseURL">,
    cacheOptions?: Omit<CacheOptions, "generateKey">,
    createNew?: boolean
};

export default function getApi(
    {
        key="default",
        options,
        cacheOptions= {
            ttl: minutesToMilliseconds(5),
        },
        createNew = false
    }: GetAPIOptions = {}
): AxiosTypedCacheInstance {
    const Api = ApiInstances[key];

    if (!createNew && Api) {
        return Api;
    }

    const env = getEnv();
    const result = setupCache(axios.create({
        withCredentials: true,
        ...options,
        baseURL: env.apiURL + "/api/v1",
    }), {
        ...cacheOptions,
        generateKey: (config) => {
            

            // Generate a key using the default method with an instance of the config that
            // does not have the id specified so that it will generate unique keys for each request
            const configWithoutId = omit(config, "id");
            const generatedKey = defaultKeyGenerator(configWithoutId);

            // If the config has an id, add the generated key to the cache manager
            if (config.id) {
                const cm = getApiCacheManager(key);
                cm.addId(config.id, generatedKey);
            }

            return generatedKey;
        }
    });

    ApiInstances[key] = result;
    return result;
}

export function getApiCacheManager(key: string = "default", createNew = false): ApiCacheManager {
    if (createNew || !(key in ApiCacheManagerInstances)) {
        ApiCacheManagerInstances[key] = new ApiCacheManager();
    }

    return ApiCacheManagerInstances[key];
}