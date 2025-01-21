import { Button } from "react-bootstrap";
import { useNamedTheme } from "src/NamedTheme";
import { ToggleThemeButtonProps } from "./Types";
import DefaultCurrentThemeTooltip from "./CurrentThemeTooltipStyled";
import clsx from "clsx";

export default function ToggleThemeButtonBase({
    className,
    tooltipId="toggle-theme-tooltip",
    CurrentThemeTooltip=DefaultCurrentThemeTooltip
}: ToggleThemeButtonProps["functional"]) {
    const [{icon}, {nextTheme}] = useNamedTheme();
    
    return <>
        <CurrentThemeTooltip id={tooltipId} />

        <Button
            className={clsx("toggle-theme-button", className)}
            onClick={() => nextTheme()}
            data-tooltip-id={tooltipId}
        >
            {icon}
        </Button>
    </>;
}