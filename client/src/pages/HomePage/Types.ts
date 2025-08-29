import { RequiredCSSProperties, StyledComponentPropsWithCSS } from "@ptolemy2002/react-styled-component-utils";
import { FC } from "react"

export type HomePageProps = {
    NameField?: FC<NameFieldProps["functional"]>;
};

export type NameFieldProps = StyledComponentPropsWithCSS<{
    className?: string;
}, {
    horizontal?: boolean;
    gap?: RequiredCSSProperties["gap"];
    maxWidth?: RequiredCSSProperties["maxWidth"];
}>;