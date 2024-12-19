import styled, { css, RuleSet } from "styled-components";
import { ToggleThemeButtonStyleAttributes } from "./Types";
import Base from "./Base";

export const TooltipGlobalStyles: RuleSet = css`
    // The reason we're doing this here is that the tooltip is rendered outside of its
    // actual parent component, so we need to add a class and target it.
    .toggle-button-tooltip {
        --bs-tooltip-bg: ${({ theme }) => theme.tooltipBackgroundColor};
        --bs-tooltip-color: ${({ theme }) => theme.tooltipTextColor};
    }
`;

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