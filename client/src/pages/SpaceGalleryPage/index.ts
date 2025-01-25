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
import SpaceGalleryPageChangeButtonBase from "./PageChangeButtonBase";
import SpaceGalleryPageChangeButtonStyled from "./PageChangeButtonStyled";
import { SpaceGallerySearchContext, SpaceGallerySearchProvider } from "./Context";

export const UnstyledSpaceGalleryPage = Object.assign(Base, {
    SearchBar: Object.assign(SpaceGallerySearchBarBase, {
        SearchSettingsButton: Object.assign(SpaceGallerySearchSettingsButtonBase, {
            Tooltip: SpaceGallerySearchSettingsTooltipBase
        }),
        SearchSubmitButton: SpaceGallerySearchSubmitButtonBase,
        SearchResults: Object.assign(SpaceGallerySearchResultsBase, {
            Context: SpaceGallerySearchContext,
            Provider: SpaceGallerySearchProvider,
            PageChangeButton: SpaceGalleryPageChangeButtonBase
        })
    })
});
export default Object.assign(BaseStyled, {
    SearchBar: Object.assign(SpaceGallerySearchBarStyled, {
        SearchSettingsButton: Object.assign(SpaceGallerySearchSettingsButtonStyled, {
            Tooltip: SpaceGallerySearchSettingsTooltipStyled
        }),
        SearchSubmitButton: SpaceGallerySearchSubmitButtonStyled,
        SearchResults: Object.assign(SpaceGallerySearchResultsStyled, {
            Context: SpaceGallerySearchContext,
            Provider: SpaceGallerySearchProvider,
            PageChangeButton: SpaceGalleryPageChangeButtonStyled
        })
    })
});

export const UnstyledSpaceGallerySearchBar = Object.assign(SpaceGallerySearchBarBase, {
    SearchSettingsButton: Object.assign(SpaceGallerySearchSettingsButtonBase, {
        Tooltip: SpaceGallerySearchSettingsTooltipBase
    }),
    SearchSubmitButton: SpaceGallerySearchSubmitButtonBase,
    SearchResults: Object.assign(SpaceGallerySearchResultsBase, {
        Context: SpaceGallerySearchContext,
        Provider: SpaceGallerySearchProvider,
        PageChangeButton: SpaceGalleryPageChangeButtonBase
    })
});
export const SpaceGallerySearchBar = Object.assign(SpaceGallerySearchBarStyled, {
    SearchSettingsButton: Object.assign(SpaceGallerySearchSettingsButtonStyled, {
        Tooltip: SpaceGallerySearchSettingsTooltipStyled
    }),
    SearchSubmitButton: SpaceGallerySearchSubmitButtonStyled,
    SearchResults: Object.assign(SpaceGallerySearchResultsStyled, {
        Context: SpaceGallerySearchContext,
        Provider: SpaceGallerySearchProvider,
        PageChangeButton: SpaceGalleryPageChangeButtonStyled
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
    Provider: SpaceGallerySearchProvider,
    PageChangeButton: SpaceGalleryPageChangeButtonBase
});
export const SpaceGallerySearchResults = Object.assign(SpaceGallerySearchResultsStyled, {
    Context: SpaceGallerySearchContext,
    Provider: SpaceGallerySearchProvider,
    PageChangeButton: SpaceGalleryPageChangeButtonStyled
});

export const UnstyledSpaceGalleryPageChangeButton = SpaceGalleryPageChangeButtonBase;
export const SpaceGalleryPageChangeButton = SpaceGalleryPageChangeButtonStyled;

export * from "./Controllers";
export * from "./Context";
export * from "./Types";
export * from "./SearchParams";