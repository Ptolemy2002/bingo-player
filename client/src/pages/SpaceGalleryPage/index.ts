import Base from "./Base";
import BaseStyled from "./BaseStyled";
import SpaceGallerySearchBarBase from "./SearchBarBase";
import SpaceGallerySearchBarStyled from "./SearchBarStyled";
import SpaceGallerySearchSettingsButtonBase from "./SearchSettingsButton";
import SpaceGallerySearchSubmitButtonBase from "./SearchSubmitButton";
import SpaceGallerySearchSettingsTooltipBase from "./SearchSettingsTooltipBase";
import SpaceGallerySearchSettingsTooltipStyled from "./SearchSettingsTooltipStyled";
import SpaceGallerySearchResultsBase from "./SearchResultsBase";
import SpaceGallerySearchResultsStyled from "./SearchResultsStyled";
import SpaceGalleryPageChangeButtonBase from "./PageChangeButton";
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
        SearchSettingsButton: Object.assign(SpaceGallerySearchSettingsButtonBase, {
            Tooltip: SpaceGallerySearchSettingsTooltipStyled
        }),
        SearchSubmitButton: SpaceGallerySearchSubmitButtonBase,
        SearchResults: Object.assign(SpaceGallerySearchResultsStyled, {
            Context: SpaceGallerySearchContext,
            Provider: SpaceGallerySearchProvider,
            PageChangeButton: SpaceGalleryPageChangeButtonBase
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
    SearchSettingsButton: Object.assign(SpaceGallerySearchSettingsButtonBase, {
        Tooltip: SpaceGallerySearchSettingsTooltipBase
    }),
    SearchSubmitButton: SpaceGallerySearchSubmitButtonBase,
    SearchResults: Object.assign(SpaceGallerySearchResultsStyled, {
        Context: SpaceGallerySearchContext,
        Provider: SpaceGallerySearchProvider,
        PageChangeButton: SpaceGalleryPageChangeButtonBase
    })
});

export const UnstyledSpaceGallerySearchSettingsButton = Object.assign(SpaceGallerySearchSettingsButtonBase, {
    Tooltip: SpaceGallerySearchSettingsTooltipStyled
});
export const SpaceGallerySearchSettingsButton = Object.assign(SpaceGallerySearchSettingsButtonBase, {
    Tooltip: SpaceGallerySearchSettingsTooltipBase
});

export const SpaceGallerySearchSubmitButton = SpaceGallerySearchSubmitButtonBase;

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
    PageChangeButton: SpaceGalleryPageChangeButtonBase
});

export const SpaceGalleryPageChangeButton = SpaceGalleryPageChangeButtonBase;

export * from "./Controllers";
export * from "./Context";
export * from "./Types";
export * from "./SearchParams";