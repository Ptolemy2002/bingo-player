import styled from "styled-components";
import { SpaceGallerySearchResultsProps } from "./Types";
import Base from "./SearchResultsBase";

export default Object.assign(
    styled(Base).attrs<SpaceGallerySearchResultsProps["style"]>(
        (props) => ({
            $css: props.$css ?? null
        })
    )`
        ${({$css}) => $css}
    `,
    {
        displayName: "styled(SpaceGallerySearchResults)"
    }
);