import "axios";
import { CacheRequestConfig } from "axios-cache-interceptor";

declare module "axios" {
    // Add the necessary properties so we can use axios-cache-interceptor
    // and typed-axios-instance at the same time.
    export interface AxiosResponse {
        id: string;
        cached: boolean;
        stale?: boolean;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export interface AxiosRequestConfig<D=any, R=any> {
        id?: CacheRequestConfig<R, D>["id"];
        cache?: CacheRequestConfig<R, D>["cache"];
    }
}