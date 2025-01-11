import styled from "styled-components";
import { ToggleThemeButtonProps } from "./Types";
import Base from "./Base";

export default Object.assign(
    styled(Base).attrs<ToggleThemeButtonProps["style"]>(
        ({theme, ...props}) => ({
            $backgroundColor:
                props.$backgroundColor
                ?? theme.toggleThemeButton?.backgroundColor
                ?? "transparent",
            $activeBackgroundColor:
                props.$activeBackgroundColor
                ?? theme.toggleThemeButton?.activeBackgroundColor
                ?? theme.toggleThemeButton?.backgroundColor
                ?? "transparent",
            $hoverBackgroundColor:
                props.$hoverBackgroundColor
                ?? theme.toggleThemeButton?.hoverBackgroundColor
                ?? theme.toggleThemeButton?.backgroundColor
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