import styled from "styled-components";
import { GameCardProps } from "./Types";
import Base, {applySubComponents} from "./Base";
import { cardStyles, evaluateCardStyles } from "src/lib/Styles";
import { marginY } from "@ptolemy2002/react-styled-component-utils";

export default applySubComponents(Object.assign(
    styled(Base).attrs<GameCardProps["style"]>(
        ({theme, ...props}) => ({
            ...evaluateCardStyles(theme, props, "space"),
            $css: props.$css ?? null
        })
    )`
        ${(props) => cardStyles(props)}

        > .card-body {
            display: flex;
            flex-direction: column;
            
            // Card text takes up all space not taken by another element.
            .card-text {
                flex-grow: 1;
            }

            .btn-col {
                ${marginY("0.5rem")}
            }
        }

        ${({$css}) => $css}
    `,
    {
        displayName: "styled(GameCard)",
    }
));