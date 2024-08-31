import tailwindColors from "tailwindcss/colors.js";

/** Deprecated colors on the exported tailwind object */
const deprecated = ["lightBlue", "warmGray", "trueGray", "coolGray", "blueGray"];

// Generate the CSS for the colors
const shades = ["400", "500", "600"];
const bg = ["slate", "gray", "zinc", "neutral", "stone"];

/**
 * Genrates the CSS variable for a color shade
 * @param {string} color Name of the tailwind color
 * @param {string} name Name of the CSS variable
 * @param {string[]} shades Shades to generate
 * @returns Generated CSS variable
 */
function variablesForColorShade(color, name, shades = Object.keys(tailwindColors[color])) {
    return shades.map((shade) => `--${name}-${shade}: ${tailwindColors[color][shade]};`).join("\n\t\t\t");
}

// Generate the CSS for the colors
let css = "";
for (const color of Object.keys(tailwindColors)) {
    // Ignore deprecated colors / invalid colors
    if (deprecated.includes(color) || typeof tailwindColors[color] !== "object") continue;

    // Primary and secondary color classes
    css += `
        .${color} {
            ${variablesForColorShade(color, "primary", shades)}
        }

        .${color}-2 {
            ${variablesForColorShade(color, "secondary", shades)}
        }
    `;

    // Background color classes (only for certain colors)
    if (!bg.includes(color)) continue;

    css += `
        .${color}-bg {
            ${variablesForColorShade(color, "background")}
        }
    `;
}

/**
 * A custom Vite plugin that adds CSS colors to the global stylesheet
 * @returns {import("vite").Plugin}
 */
export function customCssColorsPlugin() {
    const virtualModuleId = "virtual:custom-colors.css";
    const resolvedVirtualModuleId = `\0${virtualModuleId}`;

    return {
        name: "custom-css-colors-plugin",
        enforce: "pre",

        // Resolve the virtual module ID for the CSS
        resolveId(id) {
            if (id === virtualModuleId) return resolvedVirtualModuleId;
        },

        load(id) {
            if (id === resolvedVirtualModuleId) return css;
        }
    };
}
