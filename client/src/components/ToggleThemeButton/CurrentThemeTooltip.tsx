import { useBreakpointQuery } from "@ptolemy2002/react-bs-media-queries";
import { CurrentThemeTooltipProps } from "./Types";
import { NamedThemes, useNamedTheme } from "src/NamedTheme";
import clsx from "clsx";
import StyledTooltip from "src/components/StyledTooltip";

function CurrentThemeTooltipBase({
    id="toggle-theme-tooltip",
    className,
    ...props
}: CurrentThemeTooltipProps["all"]) {
    const [{id: themeId}, {setTheme}] = useNamedTheme();
    const isLg = useBreakpointQuery("lg", "min");

    return (
        <StyledTooltip
            $variant="currentTheme"
            id={id}
            place={isLg ? "left" : "right"}
            className={clsx("current-theme-tooltip", className)}
            delayHide={100}

            clickable
            {...props}
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
        </StyledTooltip>
    )
}

export function applySubComponents<
    T extends typeof CurrentThemeTooltipBase
>(C: T) {
    return Object.assign(C, {});
}

export default applySubComponents(CurrentThemeTooltipBase);