import styled from "styled-components";
import { SpaceGallerySearchSubmitButtonProps } from "./Types";
import Base from "./SearchSubmitButtonBase";
import { buttonStyles, evaluateButtonStyles } from "src/lib/Styles";

export default Object.assign(
    styled(Base).attrs<SpaceGallerySearchSubmitButtonProps["style"]>(
        ({theme, ...props}) => ({
            ...evaluateButtonStyles(theme, props, "searchSubmit"),
            $css: props.$css ?? null
        })
    )`
        ${props => buttonStyles(props)}
        ${({$css}) => $css}
    `,
    {
        displayName: "styled(SpaceGallerySearchSubmitButton)"
    }
);