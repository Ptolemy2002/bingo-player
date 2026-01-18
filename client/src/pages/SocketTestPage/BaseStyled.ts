import styled from "styled-components";
import { SocketTestPageProps } from "./Types";
import Base, { applySubComponents } from "./Base";

export default applySubComponents(Object.assign(
    styled(Base).attrs<SocketTestPageProps["style"]>(
        (props) => ({
            $css: props.$css ?? null
        })
    )`
        textarea, input {
            min-width: 500px;
        }

        ${({$css}) => $css}
    `,
    {
        displayName: "styled(SocketTestPage)",
    }
));