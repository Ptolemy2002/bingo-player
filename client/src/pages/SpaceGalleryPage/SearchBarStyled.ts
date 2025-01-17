import styled, { css } from "styled-components";
import { SpaceGallerySearchBarProps } from "./Types";
import Base from "./SearchBarBase";
import { bsBreakpointMax } from "@ptolemy2002/react-styled-component-utils";

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
);