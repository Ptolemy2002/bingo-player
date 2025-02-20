import styled, { css } from "styled-components";
import { SearchSettingsTooltipProps } from "./Types";
import Base, {applySubComponents} from "./SearchSettingsTooltipBase";
import { buttonStyles, evaluateButtonStyles, evaluateTooltipStyles, tooltipStyles } from "src/lib/Styles";
import { bsBreakpointMax, bsBreakpointMin } from "@ptolemy2002/react-styled-component-utils";

export default applySubComponents(Object.assign(
    styled(Base).attrs<SearchSettingsTooltipProps["style"]>(
        ({theme, ...props}) => ({
            ...evaluateTooltipStyles(theme, props, "spaceGallerySearchSettings"),
            $pageSizeApplyButton: {
                ...evaluateButtonStyles(theme, props.$pageSizeApplyButton ?? {}, "pageSizeApply", {
                    backgroundColor: theme.backgroundColor,
                }),
                marginLeft: props.$pageSizeApplyButton?.marginLeft ?? "0.5rem"
            },
            $minWidth: props.$minWidth ?? "50vw",
            $lgLabelWidth: props.$lgLabelWidth ?? "20%",
            $mdLabelWidth: props.$mdLabelWidth ?? "50%",
            $css: props.$css ?? null,

            // Static variant since we're doing our own coloring
            variant: "light"
        })
    )`
        ${props => tooltipStyles(props)}

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
            > select, > input, > div {
                flex-shrink: 1;
                width: 100%;
            }

            > .page-size-apply-button {
                ${({$pageSizeApplyButton}) => buttonStyles($pageSizeApplyButton!)}
                margin-left: ${({$pageSizeApplyButton}) => $pageSizeApplyButton?.marginLeft};
            }
        }
        
        ${({$css}) => $css}
    `,
    {
        displayName: "styled(SearchSettingsTooltip)"
    }
));