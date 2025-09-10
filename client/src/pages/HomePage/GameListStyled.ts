import styled from "styled-components";
import { GameListProps } from "./Types";
import Base, { applySubComponents } from "./GameListBase";

export default applySubComponents(Object.assign(
    styled(Base).attrs<GameListProps["style"]>(
        (props) => ({
            $css: props.$css ?? null
        })
    )`  
        ${({$css}) => $css}
    `,
    {
        displayName: "styled(GameList)",
    }
));