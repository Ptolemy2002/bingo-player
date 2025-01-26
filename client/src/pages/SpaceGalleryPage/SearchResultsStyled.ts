import styled from "styled-components";
import { SpaceGallerySearchResultsProps } from "./Types";
import Base from "./SearchResultsBase";

export default Object.assign(
    styled(Base).attrs<SpaceGallerySearchResultsProps["style"]>(
        (props) => ({
            $gutterX: props.$gutterX ?? "1rem",
            $gutterY: props.$gutterY ?? "1rem",
            $css: props.$css ?? null
        })
    )`
        > .card-container {
            > .row {
                --bs-gutter-x: ${({$gutterX}) => $gutterX};
                --bs-gutter-y: ${({$gutterY}) => $gutterY};
                
                > .col {
                    > .card {
                        // Take up all available space in the enclosing
                        // column
                        height: 100%;
                    }
                }
            }
        }

        ${({$css}) => $css}
    `,
    {
        displayName: "styled(SpaceGallerySearchResults)"
    }
);