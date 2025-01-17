import { StyledComponentPropsWithCSS } from "@ptolemy2002/react-styled-component-utils";
import { ComponentProps, ComponentType } from "react";
import { Tooltip } from "react-tooltip";
import { ButtonStyles, TooltipStyles } from "styled-components";

export type ToggleThemeButtonProps = StyledComponentPropsWithCSS<{
    className?: string;
    tooltipId?: string;
    CurrentThemeTooltip?: ComponentType<
        Pick<
            CurrentThemeTooltipProps["functional"],
            "id"
        >
    >;
}, ButtonStyles>;

export type CurrentThemeTooltipProps = StyledComponentPropsWithCSS<ComponentProps<typeof Tooltip> & {
    className?: string;
}, TooltipStyles>;