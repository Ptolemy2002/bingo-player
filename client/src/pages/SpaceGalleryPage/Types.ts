import { GetSpacesByPropURLParams, SearchSpacesQueryParamsOutput } from "shared";
import { SetSearchParamFunction } from "@ptolemy2002/react-search-param-state";
import { RequiredCSSProperties, StyledComponentPropsWithCSS } from "@ptolemy2002/react-styled-component-utils";
import { ComponentType, ComponentProps } from "react";
import { MagnifyingGlassIconProps } from "src/components/icons/MagnifyingGlassIcon";
import { GearIconProps } from "src/components/icons/GearIcon";
import { ButtonStyles, TooltipStyles } from "styled-components";
import { Override } from "@ptolemy2002/ts-utils";
import { ButtonProps, FormProps } from "react-bootstrap";
import { Tooltip } from "react-tooltip";
import { SpaceCardProps } from "src/components/SpaceCard";
import { Scoped } from "src/lib/Styles";
import { StyledButtonProps } from "src/components/StyledButton";

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
    so: SearchSpacesQueryParamsOutput["sortOrder"];
    // sb = sort by
    sb: SearchSpacesQueryParamsOutput["sortBy"];
};

export type UseSpaceGallerySearchParamResult = Readonly<SpaceGallerySearchParams & {
    // Dynamically generate a setter for each property in SearchParams
    [K in `set${Capitalize<string & keyof SpaceGallerySearchParams>}`]: SetSearchParamFunction<SpaceGallerySearchParams>;
}>;

export type SpaceGalleryPageProps = StyledComponentPropsWithCSS<{
    className?: string;
    SearchBar?: ComponentType<SpaceGallerySearchBarProps["functional"]>;
    SearchResults?: ComponentType<SpaceGallerySearchResultsProps["functional"]>;
    CreateButton?: ComponentType<SpaceCreateButtonProps>;
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
    hide: () => void;
}, TooltipStyles & {
    minWidth?: RequiredCSSProperties["width"];
    lgLabelWidth?: RequiredCSSProperties["width"];
    mdLabelWidth?: RequiredCSSProperties["width"];
    pageSizeApplyButton?: Scoped<ButtonStyles> & {
        marginLeft?: RequiredCSSProperties["margin"];
    }
}>;

export type SpaceGallerySearchResultsProps = StyledComponentPropsWithCSS<{
    className?: string;
    SpaceCard?: ComponentType<SpaceCardProps["functional"]>;
    cardsPerRowXs?: number;
    cardsPerRowSm?: number;
    cardsPerRowMd?: number;
    cardsPerRowLg?: number;
    cardsPerRowXl?: number;
}, {
    gutterX: RequiredCSSProperties["gap"];
    gutterY: RequiredCSSProperties["gap"];
}>;

export type SpaceGalleryPageChangeButtonProps = StyledComponentPropsWithCSS<Override<ButtonProps, {
    className?: string;
    loop?: boolean;
    type?: "next" | "prev";
}>, ButtonStyles>;

export type SpaceCreateButtonProps = Omit<StyledButtonProps["all"], "$variant" | "onClick">;