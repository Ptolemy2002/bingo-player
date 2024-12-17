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
            $borderColor: props.$borderColor ?? theme.backgroundColor,
            $hoverBorderColor: props.$hoverBorderColor ?? theme.backgroundColor,
            $activeBorderColor: props.$activeBorderColor ?? theme.backgroundColor,
            $css: props.$css ?? null
        })
    )`
        --bs-btn-bg: ${({$backgroundColor}) => $backgroundColor};
        --bs-btn-hover-bg: ${({$hoverBackgroundColor}) => $hoverBackgroundColor};
        --bs-btn-active-bg: ${({$activeBackgroundColor}) => $activeBackgroundColor};

        --bs-btn-border-color: ${({$borderColor}) => $borderColor};
        --bs-btn-active-border-color: ${({$activeBorderColor}) => $activeBorderColor};
        --bs-btn-hover-border-color: ${({$hoverBorderColor}) => $hoverBorderColor};

        ${({$css}) => $css}
    `,
    {
        displayName: "styled(Header)",
    }
);