import axios, { CreateAxiosDefaults } from 'axios';
import { TypedAxios, RouteDef } from 'typed-axios-instance';
import {
    CountSpacesByPropURLParams,
    GetSpaceByExactIDURLParams,
    GetSpacesByPropURLParams,
    ListSpacePropURLParams,
    SearchSpacesCountURLParams,
    SearchSpacesURLParams,
    UpdateSpaceByIDURLParams,
    UpdateSpaceByNameURLParams,
    DuplicateSpaceByIDURLParams,
    DuplicateSpaceByNameURLParams,
    DeleteSpaceByIDURLParams,
    DeleteSpaceByNameURLParams
} from 'shared';

import {
    CountSpacesByPropQueryParamsInput,
    CountSpacesByPropResponseBody,
    CountSpacesResponseBody,
    GetSpaceByExactIDResponseBody,
    GetSpacesByPropQueryParamsInput,
    GetSpacesByPropResponseBody,
    GetSpacesQueryParamsInput,
    GetSpacesResponseBody,
    ListSpacePropQueryParamsInput,
    ListSpacePropResponseBody,
    SearchSpacesCountResponseBody,
    SearchSpacesQueryParamsInput,
    SearchSpacesResponseBody,
    UpdateSpaceByIDRequestBodyInput,
    UpdateSpaceByIDResponseBody,
    UpdateSpaceByNameRequestBodyInput,
    UpdateSpaceByNameResponseBody,
    DuplicateSpaceByIDResponseBody,
    DuplicateSpaceByNameResponseBody,
    DeleteSpaceByIDResponseBody,
    DeleteSpaceByNameResponseBody,
    NewSpaceRequestBody,
    NewSpaceResponseBody
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
            route: `/spaces/get/by-id/[id]`;
            method: 'GET';
            commonParams: {
                id: GetSpaceByExactIDURLParams['id'];
            };
            queryParams: {};
            jsonRequest: {};
            jsonResponse: GetSpaceByExactIDResponseBody;
        },

        {
            route: `/spaces/get/by-prop/[prop]/[query]`;
            method: 'GET';
            commonParams: {
                prop: GetSpacesByPropURLParams['prop'];
                query: GetSpacesByPropURLParams['query'];
            };
            queryParams: GetSpacesByPropQueryParamsInput;
            jsonRequest: {};
            jsonResponse: GetSpacesByPropResponseBody;
        },

        {
            route: `/spaces/count/by-prop/[prop]/[query]`;
            method: 'GET';
            commonParams: {
                prop: CountSpacesByPropURLParams['prop'];
                query: CountSpacesByPropURLParams['query'];
            };
            queryParams: CountSpacesByPropQueryParamsInput;
            jsonRequest: {};
            jsonResponse: CountSpacesByPropResponseBody;
        },

        {
            route: '/spaces/get/all';
            method: 'GET';
            queryParams: GetSpacesQueryParamsInput;
            jsonRequest: {};
            jsonResponse: GetSpacesResponseBody;
        },

        {
            route: '/spaces/count/all';
            method: 'GET';
            queryParams: {};
            jsonRequest: {};
            jsonResponse: CountSpacesResponseBody;
        },

        {
            route: `/spaces/search/[query]`;
            method: 'GET';
            commonParams: {
                query: SearchSpacesURLParams['query'];
            };
            queryParams: SearchSpacesQueryParamsInput;
            jsonRequest: {};
            jsonResponse: SearchSpacesResponseBody;
        },

        {
            route: `/spaces/search/[query]/count`;
            method: 'GET';
            commonParams: {
                query: SearchSpacesCountURLParams['query'];
            };
            queryParams: {};
            jsonRequest: {};
            jsonResponse: SearchSpacesCountResponseBody;
        },

        {
            route: `/spaces/get/all/list/[prop]`;
            method: 'GET';
            commonParams: {
                prop: ListSpacePropURLParams['prop'];
            };
            queryParams: ListSpacePropQueryParamsInput;
            jsonRequest: {};
            jsonResponse: ListSpacePropResponseBody;
        },

        {
            route: `/spaces/update/by-id/[id]`;
            method: 'POST';
            commonParams: {
                id: UpdateSpaceByIDURLParams['id'];
            };
            queryParams: {};
            jsonRequest: UpdateSpaceByIDRequestBodyInput;
            jsonResponse: UpdateSpaceByIDResponseBody;
        },

        {
            route: `/spaces/update/by-name/[name]`;
            method: 'POST';
            commonParams: {
                name: UpdateSpaceByNameURLParams['name'];
            };
            queryParams: {};
            jsonRequest: UpdateSpaceByNameRequestBodyInput;
            jsonResponse: UpdateSpaceByNameResponseBody;
        },

        {
            route: `/spaces/duplicate/by-id/[id]`;
            method: 'POST';
            commonParams: {
                id: DuplicateSpaceByIDURLParams['id'];
            };
            queryParams: {};
            jsonRequest: {};
            jsonResponse: DuplicateSpaceByIDResponseBody;
        },

        {
            route: `/spaces/duplicate/by-name/[name]`;
            method: 'POST';
            commonParams: {
                name: DuplicateSpaceByNameURLParams['name'];
            };
            queryParams: {};
            jsonRequest: {};
            jsonResponse: DuplicateSpaceByNameResponseBody;
        },

        {
            route: `/spaces/delete/by-id/[id]`;
            method: 'DELETE';
            commonParams: {
                id: DeleteSpaceByIDURLParams['id'];
            };
            queryParams: {};
            jsonRequest: {};
            jsonResponse: DeleteSpaceByIDResponseBody;
        },

        {
            route: `/spaces/delete/by-name/[name]`;
            method: 'DELETE';
            commonParams: {
                name: DeleteSpaceByNameURLParams['name'];
            };
            queryParams: {};
            jsonRequest: {};
            jsonResponse: DeleteSpaceByNameResponseBody;
        },

        {
            route: "/spaces/new";
            method: 'POST';
            queryParams: {};
            jsonRequest: NewSpaceRequestBody;
            jsonResponse: NewSpaceResponseBody;
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
                const cm = getApiCacheManager({ key });
                cm.addId(config.id, generatedKey);
            }

            return generatedKey;
        }
    });

    result.interceptors.request.use((config) => {
        if (!config.url) return config;

        // Replace any [param] in the URL with the corresponding value from params
        let url = config.url;
        Object.entries(config.params ?? {}).forEach(([key, value]) => {
            url = url.replaceAll(`[${key}]`, encodeURIComponent(String(value)));
        });

        return {
            ...config,
            url
        };
    });

    
    ApiInstances[key] = result;
    return result;
}

export type GetApiCacheManagerOptions = {
    key?: string,
    createNew?: boolean
};

export function getApiCacheManager({ key = "default", createNew = false }: GetApiCacheManagerOptions = {}): ApiCacheManager {
    if (createNew || !(key in ApiCacheManagerInstances)) {
        ApiCacheManagerInstances[key] = new ApiCacheManager();
    }

    return ApiCacheManagerInstances[key];
}

export async function invalidateSpaceCollectionCaches(apiKey: string = "default"): Promise<void> {
    const cm = getApiCacheManager({ key: apiKey });
    const api = getApi({ key: apiKey });

    await cm.removeByTag(api, RouteTags.getAllSpaces);
    await cm.removeByTag(api, RouteTags.getSpacesByProp);
    await cm.removeByTag(api, RouteTags.countAllSpaces);
    await cm.removeByTag(api, RouteTags.countSpacesByProp);
    await cm.removeByTag(api, RouteTags.searchSpaces);
    await cm.removeByTag(api, RouteTags.searchSpacesCount);
}