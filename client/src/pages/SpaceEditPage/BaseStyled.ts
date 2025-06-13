import styled from "styled-components";
import { SpaceEditPageProps } from "./Types";
import Base, {applySubComponents} from "./Base";

export default applySubComponents(Object.assign(
    styled(Base).attrs<SpaceEditPageProps["style"]>(
        (props) => ({
            $css: props.$css ?? null
        })
    )`
        .btn-row {
            display: flex;
            flex-direction: row;
            gap: 0.5rem;
        }

        ${({$css}) => $css}
    `,
    {
        displayName: "styled(SpaceEditPage)",
    }
));