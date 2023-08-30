// This file contains helpers for the theme system...
import { AccentColor, BackgroundColor, type Color, Theme, type ThemeConfig } from "$stores/theme";

/** A theme according to the system */
export enum SystemTheme {
    Light = "light",
    Dark = "dark"
}

/**
 * Update the theme on the document
 * @param config The user's configuration
 * @param system The system theme (light or dark)
 */
export function update(config: ThemeConfig, system: SystemTheme): void {
    // Get the theme to use
    const theme = config.active === Theme.System ? system : config.active;

    // Update the theme class
    updateClass(theme);

    // Update the accent colors
    updateAccent(config.primary, AccentType.Primary);
    updateAccent(config.secondary, AccentType.Secondary);
    updateAccent(config.background, AccentType.Background);
}

/**
 * Update the theme class on the document
 * @param theme The theme to use
 */
export function updateClass(theme: Theme | SystemTheme): void {
    // Toggle all of the themes to the right state
    for (const possibleTheme of Object.values(Theme)) {
        document.documentElement.classList.toggle(possibleTheme, possibleTheme === theme);
    }
}

enum AccentType {
    Primary = "",
    Secondary = "-2",
    Background = "-bg"
}

/**
 * Makes sure the correct color class is on the document root
 *
 * If it differs, it is removed and replaced with the correct one
 * @param color The color to use
 * @param type The type of color (primary, secondary, background)
 */
function updateAccent(color: Color, type: AccentType) {
    const accent = `${color}${type}`;

    // Find the class on the document root that matches an accent color and the optional suffix
    const possibleAccents = [...Object.values(AccentColor), ...Object.values(BackgroundColor)].map((accent) => `${accent}${type}`);
    const accentClass = Array.from(document.documentElement.classList).find((className) => possibleAccents.includes(className));
    if (accentClass && accentClass !== accent) {
        document.documentElement.classList.remove(accentClass);
    }

    document.documentElement.classList.add(accent);
}
