import styled from "styled-components";
import { GameCreateFieldProps } from "./Types";
import Base, { applySubComponents } from "./GameCreateFieldBase";

export default applySubComponents(Object.assign(
    styled(Base).attrs<GameCreateFieldProps["style"]>(
        (props) => ({
            $horizontal: props.$horizontal ?? true,
            $gap: props.$gap ?? "0.5rem",
            $maxWidth: props.$maxWidth ?? "500px",
            $css: props.$css ?? null
        })
    )`
        display: flex;
        flex-direction: ${({$horizontal}) => ($horizontal ? "row" : "column")};
        gap: ${({$gap}) => $gap};
        
        max-width: ${({$maxWidth}) => $maxWidth};
        ${({$css}) => $css}
    `,
    {
        displayName: "styled(GameCreateField)",
    }
));
