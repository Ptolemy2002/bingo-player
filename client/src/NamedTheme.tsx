import { ComponentProps, createContext, ReactNode, useCallback, useContext } from "react";
import { usePersistentState } from "@ptolemy2002/react-utils";
import { MaybeTransformer } from "@ptolemy2002/ts-utils";
import { ThemeProvider, useTheme } from "styled-components";
import isCallable from "is-callable";
import { DefaultTheme } from "styled-components";
import { wrapNumber } from "@ptolemy2002/js-math-utils";
import SunIcon from "src/components/icons/SunIcon";
import MoonIcon from "src/components/icons/MoonIcon";

export type ThemeProviderProps = ComponentProps<typeof ThemeProvider>;

export type NamedThemeReservedIds = "detect";

export type NamedTheme= {
    id: string;
    displayName: string;
    icon: ReactNode;
    value: ThemeProviderProps["theme"];
    onSwitch?: (byIndex: boolean) => void;
};

export function createNamedTheme<T extends string>(
    id: T extends NamedThemeReservedIds ? never : T,
    theme: Omit<NamedTheme, "id">
): NamedTheme & {id: T} {
    return {id, ...theme};
}

export const NamedThemes: NamedTheme[] = [
    createNamedTheme("light", {
        displayName: "Light",
        icon: <SunIcon />,
        value: {
            backgroundColor: "white",
            textColor: "black",
            borderColor: "black",
            borderWidth: "2px",

            tooltips: {
                default: {
                    backgroundColor: "black",
                    textColor: "white",
                    opacity: "100%"
                }
            },

            icons: {
                gear: {
                    outerColor: "black",
                    innerColor: "white"
                }
            }
        }
    }),
    
    createNamedTheme("dark", {
        displayName: "Dark",
        icon: <MoonIcon />,
        value: {
            backgroundColor: "black",
            textColor: "white",
            borderColor: "white",
            borderWidth: "2px",

            tooltips: {
                default: {
                    backgroundColor: "white",
                    textColor: "black",
                    opacity: "100%"
                }
            },

            alert: {
                info: {
                    backgroundColor: "#3cd2f3",
                    textColor: "black",
                    borderColor: "transparent"
                }
            },

            media: {
                grayscale: 1,
                opacity: 0.5
            },

            icons: {
                gear: {
                    outerColor: "white",
                    innerColor: "black"
                }
            }
        }
    })
];

export type SetNamedThemeCallback = (theme: MaybeTransformer<string | number, [string]>) => void;
const NamedThemeSetterContext = createContext<{
    setTheme: SetNamedThemeCallback,
    nextTheme: () => void,
    prevTheme: () => void
} | undefined>(undefined);

export function findThemeByValue(value: DefaultTheme) {
    return NamedThemes.find((theme) => theme.value === value) ?? null;
}

export function findThemeById(id: string) {
    return NamedThemes.find((theme) => theme.id === id) ?? null;
}

export function findThemeIndexById(id: string) {
    return NamedThemes.findIndex((theme) => theme.id === id);
}

export function verifyTheme(theme: string | number) {
    if (typeof theme === "number") {
        if (!NamedThemes[theme]) {
            throw new Error(`Theme with index ${theme} not found`);
        }
        return NamedThemes[theme].id;
    } else if (theme === "detect") {
        return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } else if (!findThemeById(theme)) {
        throw new Error(`Theme ${theme} not found`);
    }

    return theme;
}

export type NamedThemeProviderProps = Omit<ThemeProviderProps, "theme"> & {initial?: string | number};
export function NamedThemeProvider({initial="detect", ...props}: NamedThemeProviderProps) {
    const [currentTheme, _setCurrentTheme] = usePersistentState<string>(
        "theme", verifyTheme(initial)
    );

    const setTheme = useCallback<SetNamedThemeCallback>((theme) => {
        _setCurrentTheme((prev) => {
            const next = isCallable(theme) ? theme(prev) : theme;

            const nextTheme = findThemeById(verifyTheme(next))!;
            nextTheme.onSwitch?.(typeof next === "number");
            
            return nextTheme.id;
        });
    }, [_setCurrentTheme]);

    const nextTheme = useCallback(() => {
        _setCurrentTheme((prev) => {
            const index = findThemeIndexById(prev);
            return NamedThemes[wrapNumber(index + 1, 0, NamedThemes.length)]!.id;
        });
    }, [_setCurrentTheme]);

    const prevTheme = useCallback(() => {
        _setCurrentTheme((prev) => {
            const index = findThemeIndexById(prev);
            return NamedThemes[wrapNumber(index - 1, 0, NamedThemes.length)]!.id;
        });
    }, [_setCurrentTheme]);

    return (
        <NamedThemeSetterContext.Provider value={{setTheme, nextTheme, prevTheme}}>
            <ThemeProvider theme={findThemeById(currentTheme)!.value} {...props} />
        </NamedThemeSetterContext.Provider>
    );
}

export function useNamedTheme() {
    const theme = useTheme();
    const themeSetter = useContext(NamedThemeSetterContext);

    if (themeSetter === undefined) {
        throw new Error("useNamedTheme must be used within a NamedThemeProvider");
    }

    return [findThemeByValue(theme)!, themeSetter] as const;
}