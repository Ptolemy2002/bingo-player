import { GetSpacesByPropURLParams } from "shared";
import { SetSearchParamAction } from "@ptolemy2002/react-search-param-state";
import { StyledComponentPropsWithCSS } from "@ptolemy2002/react-styled-component-utils";
import { ComponentType } from "react";

export type SpaceGallerySearchParams = {
    // q = query
    q: string;
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

export type SpaceGalleryPageProps = StyledComponentPropsWithCSS<{
    className?: string;
    SearchBar?: ComponentType<SpaceGallerySearchBarProps["functional"]>;
}, {}>;

export type SpaceGallerySearchBarProps = StyledComponentPropsWithCSS<{
    placeholder?: string;
    className?: string;
}, {}>;