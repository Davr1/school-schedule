import { writable } from "svelte/store";

import { browser } from "$app/environment";

/** Available themes */
export enum Theme {
    System = "system",
    Light = "light",
    Dark = "dark",
    Original = "original"
}

/** All colors gray colors from `tailwindcss/colors` */
export enum BackgroundColor {
    Slate = "slate",
    Gray = "gray",
    Zinc = "zinc",
    Neutral = "neutral",
    Stone = "stone"
}

/**
 * All colors from `tailwindcss/colors` except for the grays
 *
 * (and also the ones that don't have a scale)
 *
 * The names are duplicated so:
 * 1. I can use Object.entries for the names and internal names...
 * 2. I can reuse the names from the enum in the app but keep using the internal names for the store and styles
 */
export enum AccentColor {
    Red = "red",
    Orange = "orange",
    Amber = "amber",
    Yellow = "yellow",
    Lime = "lime",
    Green = "green",
    Emerald = "emerald",
    Teal = "teal",
    Cyan = "cyan",
    Sky = "sky",
    Blue = "blue",
    Indigo = "indigo",
    Violet = "violet",
    Purple = "purple",
    Fuchsia = "fuchsia",
    Pink = "pink",
    Rose = "rose"
}

/** All colors (again from `tailwindcss/colors`) */
export type Color = AccentColor | BackgroundColor;

export interface ThemeConfig {
    /** The active theme */
    active: Theme;

    /** Background color (not all colors are available to use as a background!) */
    background: BackgroundColor;

    /** Primary accent color, used throughout the app */
    primary: Color;

    /** Secondary accent color, used for other things... */
    secondary: Color;
}

const themeConfig: ThemeConfig = {
    active: Theme.System,
    background: BackgroundColor.Zinc,
    primary: AccentColor.Blue,
    secondary: AccentColor.Green
};

// If we're on the browser, patch the default theme config with the user's preferences
if (browser) {
    const localThemeConfig = localStorage.getItem("theme");

    try {
        console.log(localThemeConfig);
        if (localThemeConfig) Object.assign(themeConfig, JSON.parse(localThemeConfig));
    } catch (e) {
        console.error("Error parsing theme config", e);
    }
}

const theme = writable(themeConfig);

// On the browser, subscribe to the theme store and update the local storage on change
if (browser) theme.subscribe((value) => localStorage.setItem("theme", JSON.stringify(value)));

export default theme;
