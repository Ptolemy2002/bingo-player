import styled from "styled-components";
import { SearchSettingsTooltipProps } from "./Types";
import Base from "./SearchSettingsTooltip";
import { evaluateTooltipStyles } from "src/lib/Styles";

export default Object.assign(
    styled(Base).attrs<SearchSettingsTooltipProps["style"]>(
        ({theme, ...props}) => ({
            ...evaluateTooltipStyles(theme, props, "spaceGallerySearchSettings"),
            $css: props.$css ?? null,

            // Static variant since we're doing our own coloring
            variant: "light"
        })
    )`
        --rt-color-white: ${({$backgroundColor}) => $backgroundColor};
        --rt-color-dark: ${({$textColor}) => $textColor};
        --rt-opacity: ${({$opacity}) => $opacity};
        
        ${({$css}) => $css}
    `,
    {
        displayName: "styled(SearchSettingsTooltip)"
    }
);