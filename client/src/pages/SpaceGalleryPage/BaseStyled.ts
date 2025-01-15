import styled from "styled-components";
import { SpaceGalleryPageProps } from "./Types";
import Base from "./Base";

export default Object.assign(
    styled(Base).attrs<SpaceGalleryPageProps["style"]>(
        (props) => ({
            $css: props.$css ?? null
        })
    )`
        ${({$css}) => $css}
    `,
    {
        displayName: "styled(SpaceGalleryPage)",
    }
);