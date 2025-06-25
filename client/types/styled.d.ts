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

    export type ButtonVariant = 
        "searchSettings" | "searchSubmit" | "toggleTheme" | "pageChange" | "pageSizeApply" | "cardViewDetails" |
        "goToSpaceEdit" | "spaceEditUndo" | "spaceEditSubmit" | "spaceEditCancel" |
        "spaceSave" | "spaceRefresh" | "spaceDelete" | "spaceDuplicate" |
        "addAlias" | "removeAlias" | "removeTag" | "addTag" | "addExample" | "removeExample" | "selectTagExisting" | "writeTag" |
        "createSpace"
    ;
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

        textColor: RequiredCSSProperties["color"],
        activeTextColor: RequiredCSSProperties["color"],
        hoverTextColor: RequiredCSSProperties["color"],
        disabledTextColor: RequiredCSSProperties["color"],
    }>;

    export type TooltipVariant = "currentTheme" | "spaceGallerySearchSettings";
    export type TooltipStyles = Partial<{
        backgroundColor: RequiredCSSProperties["backgroundColor"],
        textColor: RequiredCSSProperties["color"],
        opacity: RequiredCSSProperties["opacity"]
    }>;

    export type CardVariant = "space";
    export type CardStyles = Partial<{
        titleColor: RequiredCSSProperties["color"],
        subtitleColor: RequiredCSSProperties["color"],
        
        borderStyle: RequiredCSSProperties["borderStyle"],
        borderColor: RequiredCSSProperties["borderColor"],
        borderWidth: RequiredCSSProperties["borderWidth"],
        borderRadius: RequiredCSSProperties["borderRadius"],

        color: RequiredCSSProperties["color"],
        backgroundColor: RequiredCSSProperties["backgroundColor"]
    }>;

    export type TagBadgeStyles = Partial<{
        backgroundColor: RequiredCSSProperties["backgroundColor"],
        textColor: RequiredCSSProperties["color"],

        showBorder?: boolean,
        borderColor: RequiredCSSProperties["borderColor"],
        borderWidth: RequiredCSSProperties["borderWidth"]
    }>;

    export interface DefaultTheme {
        backgroundColor: RequiredCSSProperties["backgroundColor"],
        textColor: RequiredCSSProperties["color"],
        activeTextColor?: RequiredCSSProperties["color"],

        borderColor: RequiredCSSProperties["borderColor"],
        borderWidth: RequiredCSSProperties["borderWidth"],

        buttons?: Partial<Record<ButtonVariant, ButtonStyles>> & {
            default?: ButtonStyles
        },
        tooltips?: Partial<Record<TooltipVariant, TooltipStyles>> & {
            default?: TooltipStyles
        },
        alerts?: Partial<Record<AlertVariant, AlertStyles>> & {
            default?: AlertStyles
        },
        cards?: Partial<Record<CardVariant, CardStyles>> & {
            default?: CardStyles
        },
        tagBadges?: Record<string, TagBadgeStyles>,
        
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