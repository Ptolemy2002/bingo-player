import styled from "styled-components";
import { SpaceCardProps } from "./Types";
import Base, {applySubComponents} from "./Base";
import { cardStyles, evaluateCardStyles } from "src/lib/Styles";

export default applySubComponents(Object.assign(
    styled(Base).attrs<SpaceCardProps["style"]>(
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
        }

        ${({$css}) => $css}
    `,
    {
        displayName: "styled(SpaceCard)",
    }
));