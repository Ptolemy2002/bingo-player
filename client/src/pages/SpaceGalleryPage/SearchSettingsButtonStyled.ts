import styled from "styled-components";
import { SpaceGallerySearchSettingsButtonProps } from "./Types";
import Base from "./SearchSettingsButtonBase";
import { evaluateButtonStyles } from "src/lib/Styles";

export default Object.assign(
    styled(Base).attrs<SpaceGallerySearchSettingsButtonProps["style"]>(
        ({theme, ...props}) => ({
            ...evaluateButtonStyles(theme, props, "searchSettings"),
            $css: props.$css ?? null
        })
    )`
        --bs-btn-bg: ${({$backgroundColor}) => $backgroundColor};
        --bs-btn-hover-bg: ${({$hoverBackgroundColor}) => $hoverBackgroundColor};
        --bs-btn-active-bg: ${({$activeBackgroundColor}) => $activeBackgroundColor};
        --bs-btn-disabled-bg: ${({$disabledBackgroundColor}) => $disabledBackgroundColor};
        
        border-style: ${({$borderStyle}) => $borderStyle};
        border-width: ${({$borderWidth}) => $borderWidth};

        --bs-btn-border-color: ${({$borderColor}) => $borderColor};
        --bs-btn-hover-border-color: ${({$hoverBorderColor}) => $hoverBorderColor};
        --bs-btn-active-border-color: ${({$activeBorderColor}) => $activeBorderColor};
        --bs-btn-disabled-border-color: ${({$disabledBorderColor}) => $disabledBorderColor};

        ${({$css}) => $css}
    `,
    {
        displayName: "styled(SpaceGallerySearchSettingsButton)"
    }
);