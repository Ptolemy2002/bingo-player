import { GetSpacesByPropURLParams, SearchSpacesQueryParams } from "shared";
import { SetSearchParamAction } from "@ptolemy2002/react-search-param-state";
import { RequiredCSSProperties, StyledComponentPropsWithCSS } from "@ptolemy2002/react-styled-component-utils";
import { ComponentType, ComponentProps } from "react";
import { MagnifyingGlassIconProps } from "src/components/icons/MagnifyingGlassIcon";
import { GearIconProps } from "src/components/icons/GearIcon";
import { ButtonStyles, TooltipStyles } from "styled-components";
import { Override } from "@ptolemy2002/ts-utils";
import { ButtonProps, FormProps } from "react-bootstrap";
import { Tooltip } from "react-tooltip";
import { ErrorAlertProps } from "src/components/ErrorAlert";

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

    // so = sort order
    so: Exclude<SearchSpacesQueryParams["sortOrder"], undefined>;
    // sb = sort by
    sb: Exclude<SearchSpacesQueryParams["sortBy"], undefined>;
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
    SearchResults?: ComponentType<SpaceGallerySearchResultsProps["functional"]>;
    ErrorAlert?: ComponentType<ErrorAlertProps>;
}, {}>;

export type SpaceGallerySearchBarProps = StyledComponentPropsWithCSS<Override<FormProps, {
    placeholder?: string;
    className?: string;
    SearchSettingsButton?: ComponentType<SpaceGallerySearchSettingsButtonProps["functional"]>; 
    SearchSubmitButton?: ComponentType<SpaceGallerySearchSubmitButtonProps["functional"]>;
    PageChangeButton?: ComponentType<SpaceGalleryPageChangeButtonProps["functional"]>;
}>, {
    gap: RequiredCSSProperties["gap"];
}>;

export type SpaceGallerySearchSettingsButtonProps = StyledComponentPropsWithCSS<
    Override<ButtonProps, {
        className?: string;
        tooltipId?: string;
        GearIcon?: ComponentType<GearIconProps>;
        SearchSettingsTooltip?: ComponentType<SearchSettingsTooltipProps["functional"]>;
    }>,
    ButtonStyles
>;

export type SpaceGallerySearchSubmitButtonProps = StyledComponentPropsWithCSS<
    Override<ButtonProps, {
        className?: string;
        MagnifyingGlassIcon?: ComponentType<MagnifyingGlassIconProps>;
    }>,
    ButtonStyles
>;

export type SearchSettingsTooltipProps = StyledComponentPropsWithCSS<ComponentProps<typeof Tooltip> & {
    className?: string;
}, TooltipStyles & {
    minWidth?: RequiredCSSProperties["width"];
    lgLabelWidth?: RequiredCSSProperties["width"];
    mdLabelWidth?: RequiredCSSProperties["width"];
}>;

export type SpaceGallerySearchResultsProps = StyledComponentPropsWithCSS<{
    className?: string;
}, {}>;

export type SpaceGalleryPageChangeButtonProps = StyledComponentPropsWithCSS<Override<ButtonProps, {
    className?: string;
    type: "next" | "prev";
}>, ButtonStyles>;