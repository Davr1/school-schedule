import { AccentColor, BackgroundColor, type Color, type Config, Theme } from "$stores/config";

/** A theme according to the system */
export type SystemTheme = "light" | "dark";

/**
 * Get the theme based on the system theme and configuration
 * @param config The user's configuration
 * @param system The system theme (light or dark)
 * @returns The theme to use
 */
export function getTheme(config: Config, system: SystemTheme): Theme {
    if (config.system && system === "dark") return config.dark;
    else return config.light;
}

/**
 * Update the theme on the document
 * @param config The user's configuration
 * @param system The system theme (light or dark)
 */
export function update(config: Config, system: SystemTheme): void {
    // Get the theme to use
    const theme = getTheme(config, system);

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
export function updateClass(theme: Theme): void {
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
