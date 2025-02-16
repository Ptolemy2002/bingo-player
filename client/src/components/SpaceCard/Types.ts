import { StyledComponentPropsWithCSS } from "@ptolemy2002/react-styled-component-utils";
import { Override } from "@ptolemy2002/ts-utils";
import { ComponentType } from "react";
import { CardProps } from "react-bootstrap";
import { CardStyles } from "styled-components";
import { TagBadgeProps } from "../TagBadge";

export type SpaceCardProps = StyledComponentPropsWithCSS<Override<CardProps, {
    className?: string;
    TagBadge?: ComponentType<TagBadgeProps["functional"]>;
}>, CardStyles>;