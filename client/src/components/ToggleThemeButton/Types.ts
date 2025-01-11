import { RequiredCSSProperties, StyledComponentPropsWithCSS } from "@ptolemy2002/react-styled-component-utils";
import { ComponentProps, ComponentType } from "react";
import { Tooltip } from "react-tooltip";

export type ToggleThemeButtonProps = StyledComponentPropsWithCSS<{
    className?: string;
    tooltipId?: string;
    CurrentThemeTooltip?: ComponentType<
        Pick<
            CurrentThemeTooltipProps["functional"],
            "id"
        >
    >;
}, {
    backgroundColor?: RequiredCSSProperties["backgroundColor"];
    hoverBackgroundColor?: RequiredCSSProperties["backgroundColor"];
    activeBackgroundColor?: RequiredCSSProperties["backgroundColor"];
}>;

export type CurrentThemeTooltipProps = StyledComponentPropsWithCSS<ComponentProps<typeof Tooltip> & {
    className?: string;
}, {
    backgroundColor?: RequiredCSSProperties["backgroundColor"];
    textColor?: RequiredCSSProperties["color"];
}>;