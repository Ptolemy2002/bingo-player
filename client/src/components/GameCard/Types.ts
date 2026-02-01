import { StyledComponentPropsWithCSS } from "@ptolemy2002/react-styled-component-utils";
import { MaybePromise, Override } from "@ptolemy2002/ts-utils";
import { CardProps } from "react-bootstrap";
import { BingoGame } from "shared";
import { CardStyles } from "styled-components";

export type GameCardProps = StyledComponentPropsWithCSS<Override<CardProps, {
    className?: string;
    showViewLink?: boolean;
    showJoinLink?: boolean;
    onJoinClicked?: () => MaybePromise<void>;
    game: BingoGame;
}>, CardStyles>;