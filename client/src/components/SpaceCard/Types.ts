import { StyledComponentPropsWithCSS } from "@ptolemy2002/react-styled-component-utils";
import { Override } from "@ptolemy2002/ts-utils";
import { CardProps } from "react-bootstrap";
import { CardStyles } from "styled-components";

export type SpaceCardProps = StyledComponentPropsWithCSS<Override<CardProps, {
    className?: string;
}>, CardStyles>;