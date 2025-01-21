import { Tooltip } from "react-tooltip";
import { useBreakpointQuery } from "@ptolemy2002/react-bs-media-queries";
import { CurrentThemeTooltipProps } from "./Types";
import { NamedThemes, useNamedTheme } from "src/NamedTheme";
import clsx from "clsx";

export default function CurrentThemeTooltipBase({
    id="toggle-theme-tooltip",
    className,
    ...props
}: CurrentThemeTooltipProps["functional"]) {
    const [{id: themeId}, {setTheme}] = useNamedTheme();
    const isLg = useBreakpointQuery("lg", "min");

    return (
        <Tooltip
            id={id}
            place={isLg ? "left" : "right"}
            delayHide={100}
            clickable
            {...props}
            className={clsx("current-theme-tooltip", className)}
        >
            Current theme: {" "}
            <select value={themeId} onChange={(e) => setTheme(e.target.value)}>
                <option value="detect">Auto</option>
                {NamedThemes.map(({id, displayName}) => (
                    <option
                        key={id}
                        value={id}
                    >
                        {displayName}
                    </option>
                ))}
            </select>
        </Tooltip>
    )
}