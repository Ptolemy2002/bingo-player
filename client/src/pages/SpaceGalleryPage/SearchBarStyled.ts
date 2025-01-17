import styled from "styled-components";
import { SpaceGallerySearchBarProps } from "./Types";
import Base from "./SearchBarBase";

export default Object.assign(
    styled(Base).attrs<SpaceGallerySearchBarProps["style"]>(
        (props) => ({
            $gap: props.$gap ?? "5px",
            $css: props.$css ?? null
        })
    )`
        display: flex;
        flex-direction: row;
        gap: ${({$gap}) => $gap};

        > .input {
            flex-grow: 1
        }

        ${({$css}) => $css}
    `,
    {
        displayName: "styled(SpaceGallerySearchBar)"
    }
);