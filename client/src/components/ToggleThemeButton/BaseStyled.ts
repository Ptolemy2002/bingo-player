import styled from "styled-components";
import { ToggleThemeButtonProps } from "./Types";
import Base from "./Base";
import { buttonStyles, evaluateButtonStyles } from "src/lib/Styles";

export default Object.assign(
    styled(Base).attrs<ToggleThemeButtonProps["style"]>(
        ({theme, ...props}) => ({
            ...evaluateButtonStyles(theme, props, "toggleTheme"),
            $css: props.$css ?? null
        })
    )`
        ${props => buttonStyles(props)}
        
        // Prevent taking up full width when the navbar is collapsed
        width: fit-content;

        // Remove padding for alignment purposes
        padding: 0;

        ${({$css}) => $css}
    `,
    {
        displayName: "styled(ToggleThemeButton)"
    }
);