import { Button } from "react-bootstrap";
import { useNamedTheme } from "src/NamedTheme";
import { ToggleThemeButtonProps } from "./Types";
import DefaultCurrentThemeTooltip from "./CurrentThemeTooltipStyled";

export default function ToggleThemeButtonBase({
    className,
    tooltipId="toggle-theme-tooltip",
    CurrentThemeTooltip=DefaultCurrentThemeTooltip
}: ToggleThemeButtonProps["functional"]) {
    const [{icon}, {nextTheme}] = useNamedTheme();
    
    return <>
        <CurrentThemeTooltip id={tooltipId} />

        <Button
            className={className}
            onClick={() => nextTheme()}
            data-tooltip-id={tooltipId}
        >
            {icon}
        </Button>
    </>;
}