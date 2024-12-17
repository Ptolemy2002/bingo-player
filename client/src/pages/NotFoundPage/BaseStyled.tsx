import styled from "styled-components";
import { NotFoundPageStyleAttributes } from "./Types";
import Base from "./Base";

export default Object.assign(
    styled(Base).attrs<NotFoundPageStyleAttributes>(
        (props) => ({
            $css: props.$css ?? null,
        })
    )`
        ${({$css}) => $css}
    `,
    {
        displayName: "styled(NotFoundPage)",
    }
);