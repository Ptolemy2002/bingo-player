import { RequiredCSSProperties, StyledComponentPropsWithCSS } from "@ptolemy2002/react-styled-component-utils";
import { Override } from "@ptolemy2002/ts-utils";
import { FC } from "react"
import { FormProps } from "react-bootstrap";
import { SocketID } from "shared";

export type HomePageProps = {
    NameField?: FC<NameFieldProps["functional"]>;
    GameList?: FC<GameListProps["functional"]>;
};

export type NameFieldProps = StyledComponentPropsWithCSS<
    Override<FormProps, {
        className?: string;
    }>, {
        horizontal?: boolean;
        gap?: RequiredCSSProperties["gap"];
        maxWidth?: RequiredCSSProperties["maxWidth"];
    }
>;

export type GameListProps = StyledComponentPropsWithCSS<
    {
        className?: string;
        socketId: SocketID | null;
        category?: "mine" | "not-mine" | "all";
        colSizeXs?: number;
        colSizeSm?: number;
        colSizeMd?: number;
        colSizeLg?: number;
        colSizeXl?: number;
    }, {}
>;