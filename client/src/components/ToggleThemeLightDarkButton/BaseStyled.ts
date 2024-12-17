import styled from "styled-components";
import { ToggleThemeLightDarkButtonStyleAttributes } from "./Types";
import Base from "./Base";

export default Object.assign(
    styled(Base).attrs<ToggleThemeLightDarkButtonStyleAttributes>(
        ({theme, ...props}) => ({
            $backgroundColor: props.$backgroundColor ?? theme.lightDarkButtonBackgroundColor,
            $activeBackgroundColor:
                props.$activeBackgroundColor
                ?? theme.lightDarkButtonActiveBackgroundColor
                ?? theme.lightDarkButtonBackgroundColor,
            $hoverBackgroundColor: props.$hoverBackgroundColor ?? theme.lightDarkButtonBackgroundColor,
            $css: props.$css ?? null
        })
    )`
        --bs-btn-bg: ${({$backgroundColor}) => $backgroundColor};
        --bs-btn-hover-bg: ${({$hoverBackgroundColor}) => $hoverBackgroundColor};
        --bs-btn-active-bg: ${({$activeBackgroundColor}) => $activeBackgroundColor};
        border-style: none;

        ${({$css}) => $css}
    `,
    {
        displayName: "styled(Header)",
    }
);