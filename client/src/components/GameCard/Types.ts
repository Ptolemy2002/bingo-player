import { StyledComponentPropsWithCSS } from "@ptolemy2002/react-styled-component-utils";
import { Override } from "@ptolemy2002/ts-utils";
import { CardProps } from "react-bootstrap";
import { BingoGame } from "shared";
import { CardStyles } from "styled-components";

export type GameCardProps = StyledComponentPropsWithCSS<Override<CardProps, {
    className?: string;
    game: BingoGame;
}>, CardStyles>;