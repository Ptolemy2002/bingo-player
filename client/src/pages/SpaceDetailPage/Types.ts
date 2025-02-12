import { StyledComponentPropsWithCSS } from "@ptolemy2002/react-styled-component-utils";
import { ComponentType } from "react";
import { ErrorAlertProps } from "src/components/alerts/ErrorAlert";
import { LoadingAlertProps } from "src/components/alerts/LoadingAlert";

export type SpaceDetailPageProps = StyledComponentPropsWithCSS<{
    className?: string;
    ErrorAlert?: ComponentType<ErrorAlertProps>;
    LoadingAlert?: ComponentType<LoadingAlertProps>;
}, {}>;