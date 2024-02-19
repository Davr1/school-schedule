import type { ThemeConfig } from "$stores/theme";

type Config = { [key in keyof ThemeConfig]?: `${ThemeConfig[key]}` };

// Load the user's theme from local storage and apply it to the document
let { active, primary, secondary, background } = JSON.parse(localStorage.getItem("theme") ?? "{}") as Config;

// If the theme is not set, set it to the defaults
active ??= "system";
primary ??= "blue";
secondary ??= "green";
background ??= "zinc";

// If the theme is set to system, set it to the system's theme
if (active === "system") active = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
// Set the primary and background colors to "original" for the icon (using as any, cuz it's not really valid, but it works)
else if (active === "original") primary = background = "original" as any;

// Apply the theme to the document
document.documentElement.classList.add(
    active,

    primary!,
    secondary + "-2",
    background + "-bg"
);

// Update the icons
document
    .querySelectorAll<HTMLLinkElement>("link[rel$='icon']")
    .forEach((node) => (node.href = node.href.replace(/zinc-blue$/, background + "-" + primary)));
