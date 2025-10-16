import { RequiredCSSProperties, StyledComponentPropsWithCSS } from "@ptolemy2002/react-styled-component-utils";
import { Override } from "@ptolemy2002/ts-utils";
import { FC, HTMLProps, MouseEvent } from "react"
import { FormProps } from "react-bootstrap";
import { SocketID } from "shared";

export type HomePageProps = StyledComponentPropsWithCSS<{
    NameField?: FC<NameFieldProps["functional"]>;
    GameCreateField?: FC<GameCreateFieldProps["functional"]>;
    GameList?: FC<GameListProps["functional"]>;
    className?: string;
}, {}>;

export type NameFieldProps = StyledComponentPropsWithCSS<
    Override<FormProps, {
        className?: string;
    }>, {
        horizontal?: boolean;
        gap?: RequiredCSSProperties["gap"];
        maxWidth?: RequiredCSSProperties["maxWidth"];
    }
>;

export type GameListCategory = "mine" | "not-mine" | "all";

export type GameListProps = StyledComponentPropsWithCSS<
    Override<HTMLProps<HTMLDivElement>, {
        className?: string;
        socketId: SocketID | null;
        category?: GameListCategory;
        colSizeXs?: number;
        colSizeSm?: number;
        colSizeMd?: number;
        colSizeLg?: number;
        colSizeXl?: number;
    }>, {}
>;

export type GameCreateFieldProps = StyledComponentPropsWithCSS<
    Override<
        FormProps, {
            className?: string;
            onClick?: (name: string, e: MouseEvent<HTMLButtonElement>) => void
        }
    >, {
        horizontal?: boolean;
        gap?: RequiredCSSProperties["gap"];
        maxWidth?: RequiredCSSProperties["maxWidth"];
    }
>;