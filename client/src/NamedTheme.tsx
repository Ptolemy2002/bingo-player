import { ComponentProps, createContext, useCallback, useContext, useState } from "react";
import { MaybeTransformer } from "@ptolemy2002/ts-utils";
import { ThemeProvider, useTheme } from "styled-components";
import isCallable from "is-callable";
import { DefaultTheme } from "styled-components/dist/types";

export type ThemeProviderProps = ComponentProps<typeof ThemeProvider>;

export type NamedTheme = {
    id: string,
    displayName: string;
    value: ThemeProviderProps["theme"];
};

export const NamedThemes: NamedTheme[] = [
    {
        id: "light",
        displayName: "Light",
        value: {
            backgroundColor: "white",
            textColor: "black",
        }
    },
    
    {
        id: "dark",
        displayName: "Dark",
        value: {
            backgroundColor: "black",
            textColor: "white",
        }
    }
];

export type SetNamedThemeCallback = (theme: MaybeTransformer<string | number, [string]>) => void;
const NamedThemeSetterContext = createContext<SetNamedThemeCallback | undefined>(undefined);

export function findThemeByValue(value: DefaultTheme) {
    return NamedThemes.find((theme) => theme.value === value) ?? null;
}

export function findThemeById(id: string) {
    return NamedThemes.find((theme) => theme.id === id) ?? null;
}

export function verifyTheme(theme: string | number) {
    if (typeof theme === "number") {
        if (!NamedThemes[theme]) {
            throw new Error(`Theme with index ${theme} not found`);
        }
        return NamedThemes[theme].id;
    } else if (!findThemeById(theme)) {
        throw new Error(`Theme ${theme} not found`);
    }

    return theme;
}

export type NamedThemeProviderProps = Omit<ThemeProviderProps, "theme"> & {initial: string | number};
export function NamedThemeProvider({initial=0, ...props}: NamedThemeProviderProps) {
    const [currentTheme, _setCurrentTheme] = useState<string>(() => verifyTheme(initial));

    const setCurrentTheme = useCallback<SetNamedThemeCallback>((theme) => {
        _setCurrentTheme((prev) => {
            const next = isCallable(theme) ? theme(prev) : theme;
            return verifyTheme(next);
        });
    }, [_setCurrentTheme]);

    return (
        <NamedThemeSetterContext.Provider value={setCurrentTheme}>
            <ThemeProvider theme={findThemeById(currentTheme)!.value} {...props} />
        </NamedThemeSetterContext.Provider>
    );
}

export function useNamedTheme() {
    const theme = useTheme();
    const setTheme = useContext(NamedThemeSetterContext);

    if (setTheme === undefined) {
        throw new Error("useNamedTheme must be used within a NamedThemeProvider");
    }

    return [findThemeByValue(theme)!, setTheme] as const;
}