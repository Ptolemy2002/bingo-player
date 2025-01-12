import "styled-components";
import { RequiredCSSProperties } from "@ptolemy2002/react-styled-component-utils";

declare module "styled-components" {
    export type AlertVariant = "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark";

    export interface DefaultTheme {
        backgroundColor: RequiredCSSProperties["backgroundColor"],
        textColor: RequiredCSSProperties["color"],
        activeTextColor?: RequiredCSSProperties["color"],

        borderColor: RequiredCSSProperties["borderColor"],
        borderWidth: RequiredCSSProperties["borderWidth"],

        toggleThemeButton?: {
            backgroundColor?: RequiredCSSProperties["backgroundColor"],
            activeBackgroundColor?: RequiredCSSProperties["backgroundColor"],
            hoverBackgroundColor?: RequiredCSSProperties["backgroundColor"]
        },
        
        icons?: {
            sun?: {
                color?: RequiredCSSProperties["fill"],
            },
            
            moon?: {
                color?: RequiredCSSProperties["fill"],
            }
        },

        currentThemeTooltip?: {
            backgroundColor?: RequiredCSSProperties["backgroundColor"],
            textColor?: RequiredCSSProperties["color"]
        },

        alert?: Partial<
            Record<
                AlertVariant,
                Partial<{
                    backgroundColor: RequiredCSSProperties["backgroundColor"],
                    textColor: RequiredCSSProperties["color"],
                    borderColor: RequiredCSSProperties["borderColor"],
                    linkColor: RequiredCSSProperties["color"]
                }>
            >
        >,

        media?: {
            grayscale?: number,
            opacity?: number
        }
    }
}