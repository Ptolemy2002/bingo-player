import styled from "styled-components";
import { SpaceGallerySearchBarProps } from "./Types";
import Base from "./SearchBarBase";

export default Object.assign(
    styled(Base).attrs<SpaceGallerySearchBarProps["style"]>(
        (props) => ({
            $css: props.$css ?? null
        })
    )`
        ${({$css}) => $css}
    `,
    {
        displayName: "styled(SpaceGallerySearchBar)"
    }
);