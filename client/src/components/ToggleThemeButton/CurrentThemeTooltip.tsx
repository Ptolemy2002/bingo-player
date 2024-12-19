import { Tooltip } from "react-tooltip";
import { useBreakpointQuery } from "@ptolemy2002/react-bs-media-queries";
import { CurrentThemeTooltipProps } from "./Types";
import { NamedThemes, useNamedTheme } from "src/NamedTheme";

export default function CurrentThemeTooltipBase({
    id="toggle-theme-tooltip",
    className,
    ...props
}: CurrentThemeTooltipProps) {
    const [{id: themeId}, {setTheme}] = useNamedTheme();
    const isLg = useBreakpointQuery("lg", "min");

    return (
        <Tooltip
            id={id}
            place={isLg ? "left" : "right"}
            delayHide={100}
            clickable
            {...props}
            className={className}
        >
            Current theme: {" "}
            <select value={themeId} onChange={(e) => setTheme(e.target.value)}>
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