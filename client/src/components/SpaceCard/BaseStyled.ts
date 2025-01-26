import styled from "styled-components";
import { SpaceCardProps } from "./Types";
import Base from "./Base";

export default Object.assign(
    styled(Base).attrs<SpaceCardProps["style"]>(
        (props) => ({
            $css: props.$css ?? null
        })
    )`
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
);