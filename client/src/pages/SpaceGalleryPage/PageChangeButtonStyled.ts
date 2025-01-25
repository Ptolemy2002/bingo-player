import styled from "styled-components";
import { SpaceGalleryPageChangeButtonProps } from "./Types";
import Base from "./PageChangeButtonBase";
import { buttonStyles, evaluateButtonStyles } from "src/lib/Styles";

export default Object.assign(
    styled(Base).attrs<SpaceGalleryPageChangeButtonProps["style"]>(
        ({theme, ...props}) => ({
            ...evaluateButtonStyles(theme, props, "pageChange"),
            $css: props.$css ?? null
        })
    )`
        ${props => buttonStyles(props)}
        ${({$css}) => $css}
    `,
    {
        displayName: "styled(SpaceGalleryPageChangeButton)"
    }
);