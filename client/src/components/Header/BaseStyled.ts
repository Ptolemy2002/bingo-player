import styled from "styled-components";
import { HeaderStyleAttributes } from "./Types";
import Base from "./Base";

export default Object.assign(
    styled(Base).attrs<HeaderStyleAttributes>(
        ({theme, ...props}) => ({
            $css: props.$css ?? null,
            $linkColor: props.$linkColor ?? theme.textColor,
            $activeLinkColor: props.$activeLinkColor ?? props.$linkColor ?? theme.activeTextColor ?? theme.textColor,
            $brandColor: props.$brandColor ?? props.$linkColor ?? theme.textColor,
            $brandHoverColor: props.$brandHoverColor ?? props.$brandColor ?? props.$linkColor ?? theme.textColor,
            $borderColor: props.$borderColor ?? theme.borderColor,
            $borderWidth: props.$borderWidth ?? theme.borderWidth
        })
    )`
        --bs-navbar-brand-color: ${({$brandColor}) => $brandColor};
        --bs-navbar-brand-hover-color: ${({$brandHoverColor}) => $brandHoverColor};
        --bs-navbar-active-color: ${({$activeLinkColor}) => $activeLinkColor};
        --bs-navbar-toggler-border-color: ${({$borderColor}) => $borderColor};
        --bs-border-width: ${({$borderWidth}) => $borderWidth};

        > .navbar-toggler {
            // Allows us to override the box-shadow of the toggler
            color: ${({$borderColor}) => $borderColor};
        }

        ${({$css}) => $css}
    `,
    {
        displayName: "styled(ToggleThemeButton)",
    }
);