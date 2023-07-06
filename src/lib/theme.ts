import colors from "tailwindcss/colors";

import type { Config, Theme } from "$stores/config";

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

    // Update the theme variables
    updateVariables(config, theme);
}

/**
 * Update the theme class on the document
 * @param theme The theme to use
 */
export function updateClass(theme: Theme): void {
    // If the themes are the same, return
    if (document.documentElement.classList.contains(theme)) return;

    // Remove all classes from the root element
    document.documentElement.classList.remove("light", "dark", "original");

    // Add the class name to the root element
    document.documentElement.classList.add(theme);
}

/**
 * Update css variables on the document
 * @param config The user's configuration
 * @param theme The theme to use
 */
export function updateVariables(config: Config, theme: Theme): void {
    // Don't update if the theme is @Davr1's Original Theme
    if (theme === "original") return;

    // Loop through the colors
    for (const [key, value] of Object.entries(colors[config.primary])) {
        updateVariable("primary", key, value);
    }

    for (const [key, value] of Object.entries(colors[config.secondary])) {
        updateVariable("secondary", key, value);
    }

    for (const [key, value] of Object.entries(colors[config.background])) {
        updateVariable("background", key, value);
    }
}

/**
 * Update a theme css variable on the document
 * @param name The type of the variable (primary, secondary, background)
 * @param key The key of the variable (the shade)
 * @param value The value of the variable (the color)
 */
export function updateVariable(name: string, key: string, value: string): void {
    const variable = `--${name}-${key}`;

    // Only do the update if the value is different
    if (document.documentElement.style.getPropertyValue(variable) === value) return;

    document.documentElement.style.setProperty(variable, value);
}
