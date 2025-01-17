import { RequiredCSSProperties } from "@ptolemy2002/react-styled-component-utils";
import { TooltipVariant } from "styled-components";
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
            ?? defaults.borderStyle
            ?? "none",
        $borderWidth:
            props.$borderWidth
            ?? theme.buttons?.[variant]?.borderWidth
            ?? theme.borderWidth,

        $borderColor:
            props.$borderColor
            ?? theme.buttons?.[variant]?.borderColor
            ?? theme.borderColor,
        $activeBorderColor:
            props.$activeBorderColor
            ?? theme.buttons?.[variant]?.activeBorderColor
            ?? props.$borderColor
            ?? theme.buttons?.[variant]?.borderColor
            ?? theme.borderColor,
        $hoverBorderColor:
            props.$hoverBorderColor
            ?? theme.buttons?.[variant]?.hoverBorderColor
            ?? props.$borderColor
            ?? theme.buttons?.[variant]?.borderColor
            ?? theme.borderColor,
        $disabledBorderColor:
            props.$disabledBorderColor
            ?? theme.buttons?.[variant]?.disabledBorderColor
            ?? props.$borderColor
            ?? theme.buttons?.[variant]?.borderColor
            ?? theme.borderColor,

        
        $backgroundColor:
            props.$backgroundColor
            ?? theme.buttons?.[variant]?.backgroundColor
            ?? defaults.backgroundColor
            ?? "transparent",
        $activeBackgroundColor:
            props.$activeBackgroundColor
            ?? theme.buttons?.[variant]?.activeBackgroundColor
            ?? props.$backgroundColor
            ?? theme.buttons?.[variant]?.backgroundColor
            ?? defaults.backgroundColor
            ?? "transparent",
        $hoverBackgroundColor:
            props.$hoverBackgroundColor
            ?? theme.buttons?.[variant]?.hoverBackgroundColor
            ?? props.$backgroundColor
            ?? theme.buttons?.[variant]?.backgroundColor
            ?? defaults.backgroundColor
            ?? "transparent",
        $disabledBackgroundColor:
            props.$disabledBackgroundColor
            ?? theme.buttons?.[variant]?.disabledBackgroundColor
            ?? props.$backgroundColor
            ?? theme.buttons?.[variant]?.backgroundColor
            ?? defaults.backgroundColor
            ?? "transparent",
    }
}

export function evaluateTooltipStyles(
    theme: DefaultTheme, props: TooltipStylesScoped,
    variant: TooltipVariant
): Required<TooltipStylesScoped> {
    return {
        $backgroundColor:
            props.$backgroundColor
            ?? theme.tooltips?.[variant]?.backgroundColor
            ?? theme.backgroundColor,
        $textColor:
            props.$textColor
            ?? theme.tooltips?.[variant]?.textColor
            ?? theme.textColor,
    }
}