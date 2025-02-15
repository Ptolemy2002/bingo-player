import { StyledComponentPropsWithCSS } from '@ptolemy2002/react-styled-component-utils';
import { ComponentProps } from 'react';
import { Tooltip } from 'react-tooltip';
import { evaluateTooltipStyles, tooltipStyles } from 'src/lib/Styles';
import styled, { ButtonStyles, TooltipVariant } from 'styled-components';

export type StyledTooltipProps = StyledComponentPropsWithCSS<
    ComponentProps<typeof Tooltip>,
    ButtonStyles & {
        variant: TooltipVariant;
    }
>;

export function StyledButtonBase(props: StyledTooltipProps["functional"]) {
    return (
        <Tooltip
            {...props}
        />
    );
}

export default Object.assign(
    styled(StyledButtonBase).attrs<StyledTooltipProps["style"]>(
        ({theme, $variant, ...props}) => ({
            ...evaluateTooltipStyles(theme, props, $variant),
            $css: props.$css ?? null,

            // Static variant since we do our own theming
            variant: "light"
        })
    )`
        ${(props) => tooltipStyles(props)}
        ${({$css}) => $css}
    `,
    {
        displayName: "styled(StyledTooltip)",
    }
);