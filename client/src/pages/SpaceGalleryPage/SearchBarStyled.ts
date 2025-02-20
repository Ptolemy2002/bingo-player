import styled, { css } from "styled-components";
import { SpaceGallerySearchBarProps } from "./Types";
import Base, {applySubComponents} from "./SearchBarBase";
import { bsBreakpointMax } from "@ptolemy2002/react-styled-component-utils";

export default applySubComponents(Object.assign(
    styled(Base).attrs<SpaceGallerySearchBarProps["style"]>(
        (props) => ({
            $gap: props.$gap ?? "5px",
            $css: props.$css ?? null
        })
    )`
        display: flex;
        flex-direction: row;

        gap: ${({$gap}) => $gap};

        // Stick to the top of the page
        // when scrolling down
        position: sticky;
        top: 0;
        z-index: 1000;

        > .buttons {
            display: flex;
            flex-direction: row;
        }

        ${bsBreakpointMax("md", css`
            flex-direction: column;

            > .buttons {
                width: 100%;
            }
        `)}

        > .input {
            flex-grow: 1
        }

        ${({$css}) => $css}
    `,
    {
        displayName: "styled(SpaceGallerySearchBar)"
    }
));