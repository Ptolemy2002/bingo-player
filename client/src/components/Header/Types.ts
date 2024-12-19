import { RequiredCSSProperties, StyledComponentPropsWithCSS } from "@ptolemy2002/react-styled-component-utils";

export type HeaderProps = StyledComponentPropsWithCSS<{
    title: string;
    className?: string;
}, {
    linkColor?: RequiredCSSProperties["color"];
    activeLinkColor?: RequiredCSSProperties["color"];
    brandColor?: RequiredCSSProperties["color"];
    brandHoverColor?: RequiredCSSProperties["color"];
    borderColor?: RequiredCSSProperties["borderColor"];
    borderWidth?: RequiredCSSProperties["borderWidth"];
}>;