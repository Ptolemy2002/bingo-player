import { Button } from "react-bootstrap";
import { useNamedTheme } from "src/NamedTheme";
import { ToggleThemeButtonProps } from "./Types";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { useBreakpointQuery } from "@ptolemy2002/react-bs-media-queries";
import { Tooltip } from "react-bootstrap";

export default function ToggleThemeButtonBase({
    className,
    tooltipClassName="toggle-button-tooltip"
}: ToggleThemeButtonProps) {
    const [{icon, displayName}, {nextTheme}] = useNamedTheme();
    const isLg = useBreakpointQuery("lg", "min");

    return (
        <OverlayTrigger
            placement={isLg ? "left" : "right"}
            delay={{show: 250, hide: 400}}
            overlay={
                <Tooltip className={tooltipClassName}>
                    Current Theme: {displayName}
                </Tooltip>
            }
        >
            <Button
                className={className}
                onClick={() => nextTheme()}
            >
                {icon}
            </Button>
        </OverlayTrigger>
    );
}