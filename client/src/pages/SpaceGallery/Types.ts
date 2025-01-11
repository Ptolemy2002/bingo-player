import { GetSpacesByPropURLParams } from "shared";
import { SetSearchParamAction } from "@ptolemy2002/react-search-param-state";

export type SpaceGallerySearchParams = {
    // q = query
    q: string | null;
    // cat = category
    cat: GetSpacesByPropURLParams["prop"] | "general";
    // cs = case sensitive
    cs: boolean;
    // mw = match whole
    mw: boolean;
    // as = accent sensitive
    as: boolean;
    // i = invert
    i: boolean;

    // ps = page size
    ps: number;
    // p = page
    p: number;
};

export type UseSpaceGallerySearchParamResult = Readonly<SpaceGallerySearchParams & {
    // Dynamically generate a setter for each property in SearchParams
    [K in `set${Capitalize<string & keyof SpaceGallerySearchParams>}`]: (value: SetSearchParamAction<
        SpaceGallerySearchParams,
        K extends `set${infer R}` ? Uncapitalize<R> : never
    >) => void;
}>;