import { StyledComponentPropsWithCSS } from "@ptolemy2002/react-styled-component-utils";
import { Override } from "@ptolemy2002/ts-utils";
import { CardProps } from "react-bootstrap";

export type SpaceCardProps = StyledComponentPropsWithCSS<Override<CardProps, {
    className?: string;
}>, {}>;