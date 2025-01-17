import Base from "./Base";
import BaseStyled from "./BaseStyled";
import SpaceGallerySearchBarBase from "./SearchBarBase";
import SpaceGallerySearchBarStyled from "./SearchBarStyled";
import SpaceGallerySearchSetingsButtonBase from "./SearchSettingsButtonBase";
import SpaceGallerySearchSettingsButtonStyled from "./SearchSettingsButtonStyled";
import SpaceGallerySearchSubmitButtonBase from "./SearchSubmitButtonBase";
import SpaceGallerySearchSubmitButtonStyled from "./SearchSubmitButtonStyled";
import SpaceGallerySearchSettingsTooltipBase from "./SearchSettingsTooltip";
import SpaceGallerySearchSettingsTooltipStyled from "./SearchSettingsTooltipStyled";

export const UnstyledSpaceGalleryPage = Object.assign(Base, {
    SearchBar: SpaceGallerySearchBarBase
});
export default Object.assign(BaseStyled, {
    SearchBar: SpaceGallerySearchBarStyled
});

export const UnstyledSpaceGallerySearchBar = Object.assign(SpaceGallerySearchBarBase, {
    SearchSettingsButton: SpaceGallerySearchSetingsButtonBase,
    SearchSubmitButton: SpaceGallerySearchSubmitButtonBase
});
export const SpaceGallerySearchBar = Object.assign(SpaceGallerySearchBarStyled, {
    SearchSettingsButton: SpaceGallerySearchSettingsButtonStyled,
    SearchSubmitButton: SpaceGallerySearchSubmitButtonStyled
});

export const UnstyledSpaceGallerySearchSettingsButton = Object.assign(SpaceGallerySearchSetingsButtonBase, {
    Tooltip: SpaceGallerySearchSettingsTooltipBase
});
export const SpaceGallerySearchSettingsButton = Object.assign(SpaceGallerySearchSettingsButtonStyled, {
    Tooltip: SpaceGallerySearchSettingsTooltipStyled
});

export const UnstyledSpaceGallerySearchSubmitButton = SpaceGallerySearchSubmitButtonBase;
export const SpaceGallerySearchSubmitButton = SpaceGallerySearchSubmitButtonStyled;

export const UnstyledSpaceGallerySearchSettingsTooltip = SpaceGallerySearchSettingsTooltipBase;
export const SpaceGallerySearchSettingsTooltip = SpaceGallerySearchSettingsTooltipStyled;

export * from "./Types";
export * from "./SearchParams";