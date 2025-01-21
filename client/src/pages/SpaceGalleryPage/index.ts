import Base from "./Base";
import BaseStyled from "./BaseStyled";
import SpaceGallerySearchBarBase from "./SearchBarBase";
import SpaceGallerySearchBarStyled from "./SearchBarStyled";
import SpaceGallerySearchSettingsButtonBase from "./SearchSettingsButtonBase";
import SpaceGallerySearchSettingsButtonStyled from "./SearchSettingsButtonStyled";
import SpaceGallerySearchSubmitButtonBase from "./SearchSubmitButtonBase";
import SpaceGallerySearchSubmitButtonStyled from "./SearchSubmitButtonStyled";
import SpaceGallerySearchSettingsTooltipBase from "./SearchSettingsTooltip";
import SpaceGallerySearchSettingsTooltipStyled from "./SearchSettingsTooltipStyled";
import SpaceGallerySearchResultsBase from "./SearchResultsBase";
import SpaceGallerySearchResultsStyled from "./SearchResultsStyled";
import { SpaceGallerySearchContext, SpaceGallerySearchProvider } from "./Context";

export const UnstyledSpaceGalleryPage = Object.assign(Base, {
    SearchBar: SpaceGallerySearchBarBase
});
export default Object.assign(BaseStyled, {
    SearchBar: SpaceGallerySearchBarStyled
});

export const UnstyledSpaceGallerySearchBar = Object.assign(SpaceGallerySearchBarBase, {
    SearchSettingsButton: Object.assign(SpaceGallerySearchSettingsButtonBase, {
        Tooltip: SpaceGallerySearchSettingsTooltipBase
    }),
    SearchSubmitButton: SpaceGallerySearchSubmitButtonBase,
    SearchResults: Object.assign(SpaceGallerySearchResultsBase, {
        Context: SpaceGallerySearchContext,
        Provider: SpaceGallerySearchProvider
    })
});
export const SpaceGallerySearchBar = Object.assign(SpaceGallerySearchBarStyled, {
    SearchSettingsButton: Object.assign(SpaceGallerySearchSettingsButtonStyled, {
        Tooltip: SpaceGallerySearchSettingsTooltipStyled
    }),
    SearchSubmitButton: SpaceGallerySearchSubmitButtonStyled,
    SearchResults: Object.assign(SpaceGallerySearchResultsStyled, {
        Context: SpaceGallerySearchContext,
        Provider: SpaceGallerySearchProvider
    })
});

export const UnstyledSpaceGallerySearchSettingsButton = Object.assign(SpaceGallerySearchSettingsButtonBase, {
    Tooltip: SpaceGallerySearchSettingsTooltipBase
});
export const SpaceGallerySearchSettingsButton = Object.assign(SpaceGallerySearchSettingsButtonStyled, {
    Tooltip: SpaceGallerySearchSettingsTooltipStyled
});

export const UnstyledSpaceGallerySearchSubmitButton = SpaceGallerySearchSubmitButtonBase;
export const SpaceGallerySearchSubmitButton = SpaceGallerySearchSubmitButtonStyled;

export const UnstyledSpaceGallerySearchSettingsTooltip = SpaceGallerySearchSettingsTooltipBase;
export const SpaceGallerySearchSettingsTooltip = SpaceGallerySearchSettingsTooltipStyled;

export const UnstyledSpaceGallerySearchResults = Object.assign(SpaceGallerySearchResultsBase, {
    Context: SpaceGallerySearchContext,
    Provider: SpaceGallerySearchProvider
});
export const SpaceGallerySearchResults = Object.assign(SpaceGallerySearchResultsStyled, {
    Context: SpaceGallerySearchContext,
    Provider: SpaceGallerySearchProvider
});

export * from "./Controllers";
export * from "./Context";
export * from "./Types";
export * from "./SearchParams";