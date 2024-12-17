import { Button } from "react-bootstrap";
import { useNamedTheme } from "src/NamedTheme";
import DefaultMoonIcon from "src/components/icons/MoonIcon";
import DefaultSunIcon from "src/components/icons/SunIcon";
import { ToggleThemeLightDarkButtonProps } from "./Types";

export default function ToggleThemeLightDarkButtonBase({
    className,
    SunIcon = DefaultSunIcon,
    MoonIcon = DefaultMoonIcon
}: ToggleThemeLightDarkButtonProps) {
    const [theme, setTheme] = useNamedTheme();

    return (
        <Button
            className={className}
            onClick={() => {
                setTheme((prev) => {
                    if (prev === "light") {
                        return "dark";
                    } else {
                        return "light";
                    }
                });
            }}
        >
            {theme.id === "light" ? <SunIcon /> : <MoonIcon />}
        </Button>
    );
}