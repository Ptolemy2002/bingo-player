import { Button } from "react-bootstrap";
import { useNamedTheme } from "src/NamedTheme";
import { ToggleThemeButtonProps } from "./Types";
import DefaultCurrentThemeTooltip from "./CurrentThemeTooltipStyled";

export default function ToggleThemeButtonBase({
    className,
    CurrentThemeTooltip=DefaultCurrentThemeTooltip
}: ToggleThemeButtonProps) {
    const [{icon, displayName}, {nextTheme}] = useNamedTheme();
    
    return <>
        <CurrentThemeTooltip displayName={displayName} />

        <Button
            className={className}
            onClick={() => nextTheme()}
            data-tooltip-id="toggle-theme-tooltip"
        >
            {icon}
        </Button>
    </>;
}