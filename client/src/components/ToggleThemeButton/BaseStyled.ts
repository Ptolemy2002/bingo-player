import styled from "styled-components";
import { ToggleThemeButtonStyleAttributes } from "./Types";
import Base from "./Base";

export default Object.assign(
    styled(Base).attrs<ToggleThemeButtonStyleAttributes>(
        ({theme, ...props}) => ({
            $backgroundColor:
                props.$backgroundColor
                ?? theme.toggleThemeButtonBackgroundColor
                ?? "transparent",
            $activeBackgroundColor:
                props.$activeBackgroundColor
                ?? theme.toggleThemeButtonActiveBackgroundColor
                ?? theme.toggleThemeButtonBackgroundColor
                ?? "transparent",
            $hoverBackgroundColor:
                props.$hoverBackgroundColor
                ?? theme.toggleThemeButtonHoverBackgroundColor
                ?? theme.toggleThemeButtonBackgroundColor
                ?? "transparent",
            $css: props.$css ?? null
        })
    )`
        --bs-btn-bg: ${({$backgroundColor}) => $backgroundColor};
        --bs-btn-hover-bg: ${({$hoverBackgroundColor}) => $hoverBackgroundColor};
        --bs-btn-active-bg: ${({$activeBackgroundColor}) => $activeBackgroundColor};
        border-style: none;

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