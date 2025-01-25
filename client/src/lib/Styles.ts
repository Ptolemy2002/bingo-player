import { RequiredCSSProperties } from "@ptolemy2002/react-styled-component-utils";
import { css, TooltipVariant } from "styled-components";
import { ButtonStyles, ButtonVariant, DefaultTheme, TooltipStyles } from "styled-components";

export type ButtonStylesScoped = {
    [K in keyof ButtonStyles as `$${K}`]: ButtonStyles[K]
};
export type TooltipStylesScoped = {
    [K in keyof TooltipStyles as `$${K}`]: TooltipStyles[K]
};

export function evaluateButtonStyles(
    theme: DefaultTheme, props: ButtonStylesScoped,
    variant: ButtonVariant,
    defaults: Partial<{
        borderStyle: RequiredCSSProperties["borderStyle"],
        backgroundColor: RequiredCSSProperties["backgroundColor"],
    }> = {}
): Required<ButtonStylesScoped> {
    return {
        $borderStyle: 
            props.$borderStyle
            ?? theme.buttons?.[variant]?.borderStyle
            ?? theme.buttons?.default?.borderStyle
            ?? defaults.borderStyle
            ?? "none",
        $borderWidth:
            props.$borderWidth
            ?? theme.buttons?.[variant]?.borderWidth
            ?? theme.buttons?.default?.borderWidth
            ?? theme.borderWidth,

        $borderColor:
            props.$borderColor
            ?? theme.buttons?.[variant]?.borderColor
            ?? theme.buttons?.default?.borderColor
            ?? theme.borderColor,
        $activeBorderColor:
            props.$activeBorderColor
            ?? theme.buttons?.[variant]?.activeBorderColor
            ?? theme.buttons?.default?.activeBorderColor
            ?? props.$borderColor
            ?? theme.buttons?.[variant]?.borderColor
            ?? theme.buttons?.default?.borderColor
            ?? theme.borderColor,
        $hoverBorderColor:
            props.$hoverBorderColor
            ?? theme.buttons?.[variant]?.hoverBorderColor
            ?? theme.buttons?.default?.hoverBorderColor
            ?? props.$borderColor
            ?? theme.buttons?.[variant]?.borderColor
            ?? theme.buttons?.default?.borderColor
            ?? theme.borderColor,
        $disabledBorderColor:
            props.$disabledBorderColor
            ?? theme.buttons?.[variant]?.disabledBorderColor
            ?? theme.buttons?.default?.disabledBorderColor
            ?? props.$borderColor
            ?? theme.buttons?.[variant]?.borderColor
            ?? theme.buttons?.default?.borderColor
            ?? theme.borderColor,

        
        $backgroundColor:
            props.$backgroundColor
            ?? theme.buttons?.[variant]?.backgroundColor
            ?? theme.buttons?.default?.backgroundColor
            ?? defaults.backgroundColor
            ?? "transparent",
        $activeBackgroundColor:
            props.$activeBackgroundColor
            ?? theme.buttons?.[variant]?.activeBackgroundColor
            ?? theme.buttons?.default?.activeBackgroundColor
            ?? props.$backgroundColor
            ?? theme.buttons?.[variant]?.backgroundColor
            ?? theme.buttons?.default?.backgroundColor
            ?? defaults.backgroundColor
            ?? "transparent",
        $hoverBackgroundColor:
            props.$hoverBackgroundColor
            ?? theme.buttons?.[variant]?.hoverBackgroundColor
            ?? theme.buttons?.default?.hoverBackgroundColor
            ?? props.$backgroundColor
            ?? theme.buttons?.[variant]?.backgroundColor
            ?? theme.buttons?.default?.backgroundColor
            ?? defaults.backgroundColor
            ?? "transparent",
        $disabledBackgroundColor:
            props.$disabledBackgroundColor
            ?? theme.buttons?.[variant]?.disabledBackgroundColor
            ?? theme.buttons?.default?.disabledBackgroundColor
            ?? props.$backgroundColor
            ?? theme.buttons?.[variant]?.backgroundColor
            ?? theme.buttons?.default?.backgroundColor
            ?? defaults.backgroundColor
            ?? "transparent",
    }
}

export function buttonStyles(props: ButtonStylesScoped) {
    return css`
        --bs-btn-bg: ${props.$backgroundColor};
        --bs-btn-hover-bg: ${props.$hoverBackgroundColor};
        --bs-btn-active-bg: ${props.$activeBackgroundColor};
        --bs-btn-border-color: ${props.$borderColor};
        --bs-btn-disabled-bg: ${props.$disabledBackgroundColor};

        border-style: ${props.$borderStyle};
        border-width: ${props.$borderWidth};

        --bs-btn-border-color: ${props.$borderColor};
        --bs-btn-active-border-color: ${props.$activeBorderColor};
        --bs-btn-hover-border-color: ${props.$hoverBorderColor};
        --bs-btn-disabled-border-color: ${props.$disabledBorderColor};
    `;
}

export function evaluateTooltipStyles(
    theme: DefaultTheme, props: TooltipStylesScoped,
    variant: TooltipVariant
): Required<TooltipStylesScoped> {
    return {
        $backgroundColor:
            props.$backgroundColor
            ?? theme.tooltips?.[variant]?.backgroundColor
            ?? theme.tooltips?.default?.backgroundColor
            ?? theme.backgroundColor,
        $textColor:
            props.$textColor
            ?? theme.tooltips?.[variant]?.textColor
            ?? theme.tooltips?.default?.textColor
            ?? theme.textColor,
        $opacity:
            props.$opacity
            ?? theme.tooltips?.[variant]?.opacity
            ?? theme.tooltips?.default?.opacity
            ?? 0.9,
    }
}

export function tooltipStyles(props: TooltipStylesScoped) {
    return css`
        --rt-color-white: ${props.$backgroundColor};
        --rt-color-dark: ${props.$textColor};
        --rt-opacity: ${props.$opacity};
    `;
}