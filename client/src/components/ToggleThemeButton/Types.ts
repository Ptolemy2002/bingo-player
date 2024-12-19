import { RequiredCSSProperties, WithCSSProp } from "@ptolemy2002/react-styled-component-utils";
import { FC, ComponentProps } from "react";
import { Tooltip } from "react-tooltip";

export type ToggleThemeButtonProps = {
    className?: string;
    tooltipId?: string;
    CurrentThemeTooltip?: FC<CurrentThemeTooltipProps>;
};

export type ToggleThemeButtonStyleAttributes = WithCSSProp<{
    $backgroundColor?: RequiredCSSProperties["backgroundColor"];
    $hoverBackgroundColor?: RequiredCSSProperties["backgroundColor"];
    $activeBackgroundColor?: RequiredCSSProperties["backgroundColor"];
}>;

export type CurrentThemeTooltipProps = ComponentProps<typeof Tooltip> & {
    className?: string;
};
export type CurrentThemeTooltipStyleAttributes = WithCSSProp<{
    $backgroundColor?: RequiredCSSProperties["backgroundColor"];
    $textColor?: RequiredCSSProperties["color"];
}>;