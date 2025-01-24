import "axios";

declare module "axios" {
    // Add the necessary properties so we can use axios-cache-interceptor
    // and typed-axios-instance at the same time.
    export interface AxiosResponse {
        id: string;
        cached: boolean;
        stale?: boolean;
    }
}