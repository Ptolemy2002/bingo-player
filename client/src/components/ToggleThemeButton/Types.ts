import { StyledComponentPropsWithCSS } from "@ptolemy2002/react-styled-component-utils";
import { Override } from "@ptolemy2002/ts-utils";
import { ComponentProps, ComponentType, RefObject } from "react";
import { Tooltip, TooltipRefProps } from "react-tooltip";
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

export type CurrentThemeTooltipProps = StyledComponentPropsWithCSS<
    Override<ComponentProps<typeof Tooltip>, {
        className?: string;
        ref?: RefObject<TooltipRefProps>;
    }>,
    TooltipStyles
>;