import { createProxyContext, createProxyContextProvider, useProxyContext, UseProxyContextArgsNoClass } from "@ptolemy2002/react-proxy-context";
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
    ...args: UseProxyContextArgsNoClass<SpaceGallerySearchContextValue>
) {
    return useProxyContext(SpaceGallerySearchContext, ...args);
}