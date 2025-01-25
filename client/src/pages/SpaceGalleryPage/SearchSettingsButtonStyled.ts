import styled from "styled-components";
import { SpaceGallerySearchSettingsButtonProps } from "./Types";
import Base from "./SearchSettingsButtonBase";
import { buttonStyles, evaluateButtonStyles } from "src/lib/Styles";

export default Object.assign(
    styled(Base).attrs<SpaceGallerySearchSettingsButtonProps["style"]>(
        ({theme, ...props}) => ({
            ...evaluateButtonStyles(theme, props, "searchSettings"),
            $css: props.$css ?? null
        })
    )`
        ${props => buttonStyles(props)}
        ${({$css}) => $css}
    `,
    {
        displayName: "styled(SpaceGallerySearchSettingsButton)"
    }
);