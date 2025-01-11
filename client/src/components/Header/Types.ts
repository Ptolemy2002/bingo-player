import { RequiredCSSProperties, StyledComponentPropsWithCSS } from "@ptolemy2002/react-styled-component-utils";
import { ComponentType } from "react";

export type HeaderProps = StyledComponentPropsWithCSS<{
    title: string;
    className?: string;
    MenuIcon?: ComponentType;
}, {
    linkColor?: RequiredCSSProperties["color"];
    activeLinkColor?: RequiredCSSProperties["color"];
    hoverLinkColor?: RequiredCSSProperties["color"];
    brandColor?: RequiredCSSProperties["color"];
    brandHoverColor?: RequiredCSSProperties["color"];
    togglerBorderColor?: RequiredCSSProperties["borderColor"];
    togglerBorderWidth?: RequiredCSSProperties["borderWidth"];
}>;