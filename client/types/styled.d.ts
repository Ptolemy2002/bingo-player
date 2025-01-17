import "styled-components";
import { RequiredCSSProperties } from "@ptolemy2002/react-styled-component-utils";

declare module "styled-components" {
    export type AlertVariant = "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark";
    export type AlertStyles = Partial<{
        backgroundColor: RequiredCSSProperties["backgroundColor"],
        textColor: RequiredCSSProperties["color"],
        borderColor: RequiredCSSProperties["borderColor"],
        linkColor: RequiredCSSProperties["color"]
    }>;

    export type ButtonVariant = "searchSettings" | "searchSubmit" | "toggleTheme";
    export type ButtonStyles = Partial<{
        borderStyle: RequiredCSSProperties["borderStyle"],
        borderWidth: RequiredCSSProperties["borderWidth"],

        borderColor: RequiredCSSProperties["borderColor"],
        hoverBorderColor: RequiredCSSProperties["borderColor"],
        activeBorderColor: RequiredCSSProperties["borderColor"],
        disabledBorderColor: RequiredCSSProperties["borderColor"],

        backgroundColor: RequiredCSSProperties["backgroundColor"],
        activeBackgroundColor: RequiredCSSProperties["backgroundColor"],
        hoverBackgroundColor: RequiredCSSProperties["backgroundColor"],
        disabledBackgroundColor: RequiredCSSProperties["backgroundColor"],
    }>;

    export type TooltipVariant = "currentTheme";
    export type TooltipStyles = Partial<{
        backgroundColor: RequiredCSSProperties["backgroundColor"],
        textColor: RequiredCSSProperties["color"]
    }>;

    export interface DefaultTheme {
        backgroundColor: RequiredCSSProperties["backgroundColor"],
        textColor: RequiredCSSProperties["color"],
        activeTextColor?: RequiredCSSProperties["color"],

        borderColor: RequiredCSSProperties["borderColor"],
        borderWidth: RequiredCSSProperties["borderWidth"],

        buttons?: Partial<Record<ButtonVariant, ButtonStyles>>,
        tooltips?: Partial<Record<TooltipVariant, TooltipStyles>>,
        alert?: Partial<Record<AlertVariant, AlertStyles>>,
        
        icons?: {
            sun?: {
                color?: RequiredCSSProperties["fill"],
            },
            
            moon?: {
                color?: RequiredCSSProperties["fill"],
            },

            magnifyingGlass?: {
                color?: RequiredCSSProperties["stroke"]
            },

            gear?: {
                outerColor?: RequiredCSSProperties["fill"],
                innerColor?: RequiredCSSProperties["fill"],
            }
        },

        media?: {
            grayscale?: number,
            opacity?: number
        }
    }
}