import { StyledComponentPropsWithCSS } from "@ptolemy2002/react-styled-component-utils";
import { ComponentType } from "react";
import { ErrorAlertProps } from "src/components/ErrorAlert";
import { LoadingAlertProps } from "src/components/LoadingAlert";

export type SpaceDetailPageProps = StyledComponentPropsWithCSS<{
    className?: string;
    ErrorAlert?: ComponentType<ErrorAlertProps>;
    LoadingAlert?: ComponentType<LoadingAlertProps>;
}, {}>;