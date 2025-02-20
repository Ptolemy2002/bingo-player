import styled from "styled-components";
import { SpaceDetailPageProps } from "./Types";
import Base, {applySubComponents} from "./Base";

export default applySubComponents(Object.assign(
    styled(Base).attrs<SpaceDetailPageProps["style"]>(
        (props) => ({
            $css: props.$css ?? null
        })
    )`
        ${({$css}) => $css}
    `,
    {
        displayName: "styled(SpaceDetailPage)",
    }
));