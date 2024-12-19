import { RequiredCSSProperties, WithCSSProp } from "@ptolemy2002/react-styled-component-utils";

export type ToggleThemeButtonProps = {
    className?: string;
    tooltipClassName?: string;
};

export type ToggleThemeButtonStyleAttributes = WithCSSProp<{
    $backgroundColor?: RequiredCSSProperties["backgroundColor"];
    $hoverBackgroundColor?: RequiredCSSProperties["backgroundColor"];
    $activeBackgroundColor?: RequiredCSSProperties["backgroundColor"];
}>;