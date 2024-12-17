import { RequiredCSSProperties, WithCSSProp } from "@ptolemy2002/react-styled-component-utils";

export type HeaderProps = {
    title: string;
    className?: string;
};

export type HeaderStyleAttributes = WithCSSProp<{
    $linkColor?: RequiredCSSProperties["color"];
    $activeLinkColor?: RequiredCSSProperties["color"];
    $brandColor?: RequiredCSSProperties["color"];
    $brandHoverColor?: RequiredCSSProperties["color"];
    $borderColor?: RequiredCSSProperties["borderColor"];
    $borderWidth?: RequiredCSSProperties["borderWidth"];
}>;