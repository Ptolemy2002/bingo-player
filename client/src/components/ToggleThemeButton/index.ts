import Base from "./Base";
import BaseStyled from "./BaseStyled";
import CurrentThemeTooltipBase from "./CurrentThemeTooltip";
import CurrentThemeTooltipStyled from "./CurrentThemeTooltipStyled";

// Since this is index.tsx, importing the folder itself will import this file.
// Don't put any other code in this file, just export the necessary resources.
export const UnstyledToggleThemeButton = Object.assign(Base, {
    Tooltip: CurrentThemeTooltipBase
})
// The styled component should be the default.
export default Object.assign(BaseStyled, {
    Tooltip: CurrentThemeTooltipStyled
});

export const UnstyledCurrentThemeTooltip = CurrentThemeTooltipBase;
export const CurrentThemeTooltip = CurrentThemeTooltipStyled;

// Export the types as well.
export * from "./Types";