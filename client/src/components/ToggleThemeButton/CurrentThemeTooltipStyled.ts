import styled from "styled-components";
import { CurrentThemeTooltipProps } from "./Types";
import Base from "./CurrentThemeTooltip";
import { evaluateTooltipStyles, tooltipStyles } from "src/lib/Styles";

export default Object.assign(
    styled(Base).attrs<CurrentThemeTooltipProps["style"]>(
        ({theme, ...props}) => ({
            ...evaluateTooltipStyles(theme, props, "currentTheme"),
            $css: props.$css ?? null,

            // Static variant since we're doing our own coloring
            variant: "light"
        })
    )`
        ${props => tooltipStyles(props)}
        ${({$css}) => $css}
    `,
    {
        displayName: "styled(CurrentThemeTooltip)"
    }
);