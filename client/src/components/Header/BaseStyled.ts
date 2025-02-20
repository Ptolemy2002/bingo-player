import styled from "styled-components";
import { HeaderProps } from "./Types";
import Base, {applySubComponents} from "./Base";

export default applySubComponents(Object.assign(
    styled(Base).attrs<HeaderProps["style"]>(
        ({theme, ...props}) => ({
            $css: props.$css ?? null,
            $linkColor: props.$linkColor ?? theme.textColor,
            $activeLinkColor: props.$activeLinkColor ?? props.$linkColor ?? theme.activeTextColor ?? theme.textColor,
            $hoverLinkColor: props.$hoverLinkColor ?? props.$linkColor ?? theme.textColor,
            $brandColor: props.$brandColor ?? props.$linkColor ?? theme.textColor,
            $brandHoverColor: props.$brandHoverColor ?? props.$brandColor ?? props.$linkColor ?? theme.textColor,
            $togglerBorderColor: props.$togglerBorderColor ?? theme.borderColor,
            $togglerBorderWidth: props.$togglerBorderWidth ?? theme.borderWidth
        })
    )`
        --bs-navbar-color: ${({$linkColor}) => $linkColor};
        --bs-navbar-hover-color: ${({$hoverLinkColor}) => $hoverLinkColor};
        --bs-navbar-active-color: ${({$activeLinkColor}) => $activeLinkColor};

        --bs-navbar-brand-color: ${({$brandColor}) => $brandColor};
        --bs-navbar-brand-hover-color: ${({$brandHoverColor}) => $brandHoverColor};
        
        --bs-navbar-toggler-border-color: ${({$togglerBorderColor}) => $togglerBorderColor};
        --bs-border-width: ${({$togglerBorderWidth}) => $togglerBorderWidth};

        > .navbar-toggler {
            // Allows us to override the box-shadow of the toggler
            color: ${({$togglerBorderColor}) => $togglerBorderColor};
        }

        ${({$css}) => $css}
    `,
    {
        displayName: "styled(ToggleThemeButton)",
    }
));