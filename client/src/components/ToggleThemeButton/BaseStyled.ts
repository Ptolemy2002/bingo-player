import styled from "styled-components";
import { ToggleThemeButtonProps } from "./Types";
import Base from "./Base";
import { evaluateButtonStyles } from "src/lib/Styles";

export default Object.assign(
    styled(Base).attrs<ToggleThemeButtonProps["style"]>(
        ({theme, ...props}) => ({
            ...evaluateButtonStyles(theme, props, "toggleTheme"),
            $css: props.$css ?? null
        })
    )`
        --bs-btn-bg: ${({$backgroundColor}) => $backgroundColor};
        --bs-btn-hover-bg: ${({$hoverBackgroundColor}) => $hoverBackgroundColor};
        --bs-btn-active-bg: ${({$activeBackgroundColor}) => $activeBackgroundColor};
        --bs-btn-border-color: ${({$borderColor}) => $borderColor};
        
        border-style: ${({$borderStyle}) => $borderStyle};
        border-width: ${({$borderWidth}) => $borderWidth};

        --bs-btn-border-color: ${({$borderColor}) => $borderColor};
        --bs-btn-active-border-color: ${({$activeBorderColor}) => $activeBorderColor};
        --bs-btn-hover-border-color: ${({$hoverBorderColor}) => $hoverBorderColor};
        --bs-btn-disabled-border-color: ${({$disabledBorderColor}) => $disabledBorderColor};
        
        // Prevent taking up full width when the navbar is collapsed
        width: fit-content;

        // Remove padding for alignment purposes
        padding: 0;

        ${({$css}) => $css}
    `,
    {
        displayName: "styled(ToggleThemeButton)"
    }
);