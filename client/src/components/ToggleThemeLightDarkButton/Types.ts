import { RequiredCSSProperties, WithCSSProp } from "@ptolemy2002/react-styled-component-utils";
import { FC } from "react";
import { SunIconProps } from "src/components/icons/SunIcon";
import { MoonIconProps } from "src/components/icons/MoonIcon";

export type ToggleThemeLightDarkButtonProps = {
    className?: string;
    SunIcon?: FC<SunIconProps>;
    MoonIcon?: FC<MoonIconProps>;
};

export type ToggleThemeLightDarkButtonStyleAttributes = WithCSSProp<{
    $backgroundColor?: RequiredCSSProperties["backgroundColor"];
    $hoverBackgroundColor?: RequiredCSSProperties["backgroundColor"];
    $activeBackgroundColor?: RequiredCSSProperties["backgroundColor"];
    $borderColor?: RequiredCSSProperties["borderColor"];
    $hoverBorderColor?: RequiredCSSProperties["borderColor"];
    $activeBorderColor?: RequiredCSSProperties["borderColor"];
}>;