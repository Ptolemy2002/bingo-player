import "styled-components";
import { RequiredCSSProperties } from "@ptolemy2002/react-styled-component-utils";

declare module "styled-components" {
    export interface DefaultTheme {
        backgroundColor: RequiredCSSProperties["backgroundColor"],
        textColor: RequiredCSSProperties["color"],
        activeTextColor?: RequiredCSSProperties["color"],

        borderColor: RequiredCSSProperties["borderColor"],
        borderWidth: RequiredCSSProperties["borderWidth"],

        toggleThemeButtonBackgroundColor?: RequiredCSSProperties["backgroundColor"],
        toggleThemeButtonActiveBackgroundColor?: RequiredCSSProperties["backgroundColor"],
        toggleThemeButtonHoverBackgroundColor?: RequiredCSSProperties["backgroundColor"],

        sunIconColor?: RequiredCSSProperties["fill"],
        moonIconColor?: RequiredCSSProperties["fill"],

        currentThemeTooltipBackgroundColor?: RequiredCSSProperties["backgroundColor"],
        currentThemeTooltipTextColor?: RequiredCSSProperties["color"]
    }
}