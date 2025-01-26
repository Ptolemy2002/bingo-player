import { CardVariant, css, TagBadgeStyles, TooltipVariant } from "styled-components";
import { ButtonStyles, ButtonVariant, DefaultTheme, TooltipStyles, CardStyles } from "styled-components";

export type Scoped<T extends Record<string, unknown>> = {
    [K in keyof T as `$${Extract<K, string>}`]: T[K]
};

export function evaluateButtonStyles(
    theme: DefaultTheme, props: Scoped<ButtonStyles>,
    variant: ButtonVariant,
    defaults: Partial<ButtonStyles> = {}
): Required<Scoped<ButtonStyles>> {
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
            ?? defaults.borderWidth
            ?? theme.borderWidth,

        $borderColor:
            props.$borderColor
            ?? theme.buttons?.[variant]?.borderColor
            ?? theme.buttons?.default?.borderColor
            ?? defaults.borderColor
            ?? theme.borderColor,
        $activeBorderColor:
            props.$activeBorderColor
            ?? theme.buttons?.[variant]?.activeBorderColor
            ?? theme.buttons?.default?.activeBorderColor
            ?? props.$borderColor
            ?? theme.buttons?.[variant]?.borderColor
            ?? theme.buttons?.default?.borderColor
            ?? defaults.borderColor
            ?? theme.borderColor,
        $hoverBorderColor:
            props.$hoverBorderColor
            ?? theme.buttons?.[variant]?.hoverBorderColor
            ?? theme.buttons?.default?.hoverBorderColor
            ?? props.$borderColor
            ?? theme.buttons?.[variant]?.borderColor
            ?? theme.buttons?.default?.borderColor
            ?? defaults.borderColor
            ?? theme.borderColor,
        $disabledBorderColor:
            props.$disabledBorderColor
            ?? theme.buttons?.[variant]?.disabledBorderColor
            ?? theme.buttons?.default?.disabledBorderColor
            ?? props.$borderColor
            ?? theme.buttons?.[variant]?.borderColor
            ?? theme.buttons?.default?.borderColor
            ?? defaults.borderColor
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
        
        $textColor:
            props.$textColor
            ?? theme.buttons?.[variant]?.textColor
            ?? theme.buttons?.default?.textColor
            ?? defaults.textColor
            ?? theme.textColor,
        $activeTextColor:
            props.$activeTextColor
            ?? theme.buttons?.[variant]?.activeTextColor
            ?? theme.buttons?.default?.activeTextColor
            ?? props.$textColor
            ?? theme.buttons?.[variant]?.textColor
            ?? theme.buttons?.default?.textColor
            ?? defaults.textColor
            ?? theme.textColor,
        $hoverTextColor:
            props.$hoverTextColor
            ?? theme.buttons?.[variant]?.hoverTextColor
            ?? theme.buttons?.default?.hoverTextColor
            ?? props.$textColor
            ?? theme.buttons?.[variant]?.textColor
            ?? theme.buttons?.default?.textColor
            ?? defaults.textColor
            ?? theme.textColor,
        $disabledTextColor:
            props.$disabledTextColor
            ?? theme.buttons?.[variant]?.disabledTextColor
            ?? theme.buttons?.default?.disabledTextColor
            ?? props.$textColor
            ?? theme.buttons?.[variant]?.textColor
            ?? theme.buttons?.default?.textColor
            ?? defaults.textColor
            ?? theme.textColor,
    }
}

export function buttonStyles(props: Scoped<ButtonStyles>) {
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

        --bs-btn-color: ${props.$textColor};
        --bs-btn-active-color: ${props.$activeTextColor};
        --bs-btn-hover-color: ${props.$hoverTextColor};
        --bs-btn-disabled-color: ${props.$disabledTextColor};
    `;
}

export function evaluateTooltipStyles(
    theme: DefaultTheme, props: Scoped<TooltipStyles>,
    variant: TooltipVariant,
    defaults: Partial<TooltipStyles> = {}
): Required<Scoped<TooltipStyles>> {
    return {
        $backgroundColor:
            props.$backgroundColor
            ?? theme.tooltips?.[variant]?.backgroundColor
            ?? theme.tooltips?.default?.backgroundColor
            ?? defaults.backgroundColor
            ?? theme.backgroundColor,
        $textColor:
            props.$textColor
            ?? theme.tooltips?.[variant]?.textColor
            ?? theme.tooltips?.default?.textColor
            ?? defaults.textColor
            ?? theme.textColor,
        $opacity:
            props.$opacity
            ?? theme.tooltips?.[variant]?.opacity
            ?? theme.tooltips?.default?.opacity
            ?? defaults.opacity
            ?? 0.9,
    }
}

export function tooltipStyles(props: Scoped<TooltipStyles>) {
    return css`
        --rt-color-white: ${props.$backgroundColor};
        --rt-color-dark: ${props.$textColor};
        --rt-opacity: ${props.$opacity};

        // Ensure this tooltip is always on top
        z-index: 1070;
    `;
}

export function evaluateCardStyles(
    theme: DefaultTheme, props: Scoped<CardStyles>,
    variant: CardVariant,
    defaults: Partial<CardStyles> = {}
): Required<Scoped<CardStyles>> {
    return {
        $titleColor:
            props.$titleColor
            ?? theme.cards?.[variant]?.titleColor
            ?? theme.cards?.default?.titleColor
            ?? defaults.titleColor
            ?? theme.textColor,
        $subtitleColor:
            props.$subtitleColor
            ?? theme.cards?.[variant]?.subtitleColor
            ?? theme.cards?.default?.subtitleColor
            ?? defaults.subtitleColor
            ?? theme.textColor,
        
        $borderStyle:
            props.$borderStyle
            ?? theme.cards?.[variant]?.borderStyle
            ?? theme.cards?.default?.borderStyle
            ?? defaults.borderStyle
            ?? "solid",
        $borderColor:
            props.$borderColor
            ?? theme.cards?.[variant]?.borderColor
            ?? theme.cards?.default?.borderColor
            ?? defaults.borderColor
            ?? theme.borderColor,
        $borderWidth:
            props.$borderWidth
            ?? theme.cards?.[variant]?.borderWidth
            ?? theme.cards?.default?.borderWidth
            ?? defaults.borderWidth
            ?? theme.borderWidth,
        $borderRadius:
            props.$borderRadius
            ?? theme.cards?.[variant]?.borderRadius
            ?? theme.cards?.default?.borderRadius
            ?? defaults.borderRadius
            ?? "0.375rem",

        $color:
            props.$color
            ?? theme.cards?.[variant]?.color
            ?? theme.cards?.default?.color
            ?? defaults.color
            ?? theme.textColor,
        $backgroundColor:
            props.$backgroundColor
            ?? theme.cards?.[variant]?.backgroundColor
            ?? theme.cards?.default?.backgroundColor
            ?? defaults.backgroundColor
            ?? "transparent"
    }
}

export function cardStyles(props: Scoped<CardStyles>) {
    return css`
        --bs-card-title-color: ${props.$titleColor};
        --bs-card-subtitle-color: ${props.$subtitleColor};

        border-style: ${props.$borderStyle};
        --bs-card-border-color: ${props.$borderColor};
        --bs-card-border-width: ${props.$borderWidth};
        --bs-card-border-radius: ${props.$borderRadius};

        --bs-card-color: ${props.$color};
        --bs-card-bg: ${props.$backgroundColor};
    `;
}

export function evaluateTagBadgeStyles(
    theme: DefaultTheme, props: Scoped<TagBadgeStyles>,
    tag: string,
    defaults: Partial<TagBadgeStyles> = {}
) {
    const isCollection = tag.startsWith("in:");

    return {
        $showBorder:
            props.$showBorder
            ?? theme.tagBadges?.[tag]?.showBorder
            ?? (isCollection ? theme.tagBadges?._collectionDefault?.showBorder : null)
            ?? theme.tagBadges?._default?.showBorder
            ?? defaults.showBorder
            ?? true,
        $backgroundColor:
            props.$backgroundColor
            ?? theme.tagBadges?.[tag]?.backgroundColor
            ?? (isCollection ? theme.tagBadges?._collectionDefault?.backgroundColor : null)
            ?? theme.tagBadges?._default?.backgroundColor
            ?? defaults.backgroundColor
            ?? theme.backgroundColor,
        $textColor:
            props.$textColor
            ?? theme.tagBadges?.[tag]?.textColor
            ?? (isCollection ? theme.tagBadges?._collectionDefault?.textColor : null)
            ?? theme.tagBadges?._default?.textColor
            ?? defaults.textColor
            ?? theme.textColor,
        $borderColor:
            props.$borderColor
            ?? theme.tagBadges?.[tag]?.borderColor
            ?? (isCollection ? theme.tagBadges?._collectionDefault?.borderColor : null)
            ?? theme.tagBadges?._default?.borderColor
            ?? defaults.borderColor
            ?? theme.borderColor,
        $borderWidth:
            props.$borderWidth
            ?? theme.tagBadges?.[tag]?.borderWidth
            ?? (isCollection ? theme.tagBadges?._collectionDefault?.borderWidth : null)
            ?? theme.tagBadges?._default?.borderWidth
            ?? defaults.borderWidth
            ?? theme.borderWidth,
    }
}

export function tagBadgeStyles(props: Scoped<TagBadgeStyles>) {
    return css`
        --bs-badge-color: ${props.$textColor};
        border-style: ${props.$showBorder ? "solid" : "none"};
        background-color: ${props.$backgroundColor};
        border-color: ${props.$borderColor};
        border-width: ${props.$borderWidth};
    `;
}