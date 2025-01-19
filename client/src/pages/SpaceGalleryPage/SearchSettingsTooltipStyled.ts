import styled, { css } from "styled-components";
import { SearchSettingsTooltipProps } from "./Types";
import Base from "./SearchSettingsTooltip";
import { evaluateTooltipStyles } from "src/lib/Styles";
import { bsBreakpointMax, bsBreakpointMin } from "@ptolemy2002/react-styled-component-utils";

export default Object.assign(
    styled(Base).attrs<SearchSettingsTooltipProps["style"]>(
        ({theme, ...props}) => ({
            ...evaluateTooltipStyles(theme, props, "spaceGallerySearchSettings"),
            $minWidth: props.$minWidth ?? "50vw",
            $lgLabelWidth: props.$lgLabelWidth ?? "20%",
            $mdLabelWidth: props.$mdLabelWidth ?? "50%",
            $css: props.$css ?? null,

            // Static variant since we're doing our own coloring
            variant: "light"
        })
    )`
        --rt-color-white: ${({$backgroundColor}) => $backgroundColor};
        --rt-color-dark: ${({$textColor}) => $textColor};
        --rt-opacity: ${({$opacity}) => $opacity};

        width: auto;
        min-width: ${({$minWidth}) => $minWidth};

        height: auto;

        > .input-container {
            display: flex;
            flex-direction: row;

            > label {
                ${({$lgLabelWidth}) => bsBreakpointMin("lg", css`
                    width: ${$lgLabelWidth};
                `)}

                ${({$mdLabelWidth}) => bsBreakpointMax("md", css`
                    width: ${$mdLabelWidth};
                `)}
            }
            
            // For some reason, the checkbox element is wrapped in a plain div
            > select, div {
                flex-shrink: 1;
                width: 100%;
            }
        }
        
        ${({$css}) => $css}
    `,
    {
        displayName: "styled(SearchSettingsTooltip)"
    }
);