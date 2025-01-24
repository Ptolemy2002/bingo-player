import { createProxyContext, createProxyContextProvider, Dependency, OnChangePropCallback, OnChangeReinitCallback, useProxyContext } from "@ptolemy2002/react-proxy-context";
import { MongoSpace } from "shared";

export type SpaceGallerySearchContextValue = {
    hasPressed: boolean;
    results: MongoSpace[];
    totalCount: number;
};

export const SpaceGallerySearchContext = createProxyContext<SpaceGallerySearchContextValue>(
    "SpaceGallerySearchContext"
);

export const SpaceGallerySearchProvider = createProxyContextProvider(SpaceGallerySearchContext);

export function useSpaceGallerySearchContext(
    deps: Dependency<SpaceGallerySearchContextValue>[] = [],
    onChangeProp?: OnChangePropCallback<SpaceGallerySearchContextValue>,
    onChangeReinit?: OnChangeReinitCallback<SpaceGallerySearchContextValue>,
    listenReinit = true
) {
    return useProxyContext(SpaceGallerySearchContext, deps, onChangeProp, onChangeReinit, listenReinit);
}