import { Tooltip } from "react-tooltip";
import { useBreakpointQuery } from "@ptolemy2002/react-bs-media-queries";
import { CurrentThemeTooltipProps } from "./Types";

export default function CurrentThemeTooltipBase({
    id="toggle-theme-tooltip",
    displayName,
    className,
    ...props
}: CurrentThemeTooltipProps) {
    const isLg = useBreakpointQuery("lg", "min");

    return (
        <Tooltip
            id={id}
            place={isLg ? "left" : "right"}
            delayHide={100}
            clickable
            {...props}

            content={"Current theme: " + displayName}
            className={className}
        />
    )
}