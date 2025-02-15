import { useNamedTheme } from "src/NamedTheme";
import { ToggleThemeButtonProps } from "./Types";
import DefaultCurrentThemeTooltip from "./CurrentThemeTooltip";
import clsx from "clsx";
import StyledButton from "../StyledButton";
import { css } from "styled-components";

export default function ToggleThemeButtonBase({
    className,
    tooltipId="toggle-theme-tooltip",
    CurrentThemeTooltip=DefaultCurrentThemeTooltip,
    $css,
    ...props
}: ToggleThemeButtonProps["all"]) {
    const [{icon}, {nextTheme}] = useNamedTheme();
    
    return <>
        <CurrentThemeTooltip id={tooltipId} />

        <StyledButton
            $variant="toggleTheme"
            className={clsx("toggle-theme-button", className)}
            onClick={() => nextTheme()}
            data-tooltip-id={tooltipId}

            $css={css`
                 // Prevent taking up full width when the navbar is collapsed
                width: fit-content;

                // Remove padding for alignment purposes
                padding: 0;
                ${$css}
            `}
            {...props}
        >
            {icon}
        </StyledButton>
    </>;
}