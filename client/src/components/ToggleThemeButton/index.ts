import Base from "./Base";
import CurrentThemeTooltipBase from "./CurrentThemeTooltip";

// Since this is index.tsx, importing the folder itself will import this file.
// Don't put any other code in this file, just export the necessary resources.
export default Object.assign(Base, {
    Tooltip: CurrentThemeTooltipBase
});

export const CurrentThemeTooltip = CurrentThemeTooltipBase;

// Export the types as well.
export * from "./Types";