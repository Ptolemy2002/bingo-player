import styled from "styled-components";
import { SpaceDetailPageProps } from "./Types";
import Base from "./Base";

export default Object.assign(
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
);