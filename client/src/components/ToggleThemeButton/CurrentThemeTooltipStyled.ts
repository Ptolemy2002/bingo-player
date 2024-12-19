import styled from "styled-components";
import { CurrentThemeTooltipProps } from "./Types";
import Base from "./CurrentThemeTooltip";

export default Object.assign(
    styled(Base).attrs<CurrentThemeTooltipProps["style"]>(
        ({theme, ...props}) => ({
            $backgroundColor:
                props.$backgroundColor
                ?? theme.currentThemeTooltipBackgroundColor
                ?? theme.backgroundColor,
            $textColor:
                props.$textColor
                ?? theme.currentThemeTooltipTextColor
                ?? theme.textColor,
            $css: props.$css ?? null,

            // Static variant since we're doing our own coloring
            variant: "light"
        })
    )`
        --rt-color-white: ${({$backgroundColor}) => $backgroundColor};
        --rt-color-dark: ${({$textColor}) => $textColor};

        border-style: none;

        // Prevent taking up full width when the navbar is collapsed
        width: fit-content;

        // Remove padding for alignment purposes
        padding: 0;

        ${({$css}) => $css}
    `,
    {
        displayName: "styled(CurrentThemeTooltip)"
    }
);