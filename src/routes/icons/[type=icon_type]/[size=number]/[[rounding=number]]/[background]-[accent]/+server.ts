import colors from "tailwindcss/colors";

import { renderComponent, renderSVG } from "$lib/server/render";

import Icon, { type Colors } from "$components/Icon/Icon.svelte";

import type { EntryGenerator } from "./$types";

export function GET({ params }) {
    const { type, size, rounding, background: bg, accent: acc } = params;

    const background = colors[bg as keyof typeof colors];
    const accent = colors[acc as keyof typeof colors];

    if (!background || !accent) {
        return new Response("Invalid color", { status: 400 });
    }

    const iconColors: Colors = {
        BG: background[800],
        FG: background[600],
        Accent: accent[500]
    };

    const svg = renderComponent(Icon, {
        size,
        colors: iconColors,
        rounding: rounding !== undefined ? Number(rounding) : undefined
    });

    return new Response(type === "png" ? renderSVG(svg).asPng() : svg, {
        headers: {
            "Content-Type": type === "png" ? "image/png" : "image/svg+xml"
        }
    });
}

export const prerender = true;
export const entries: EntryGenerator = () => {
    // Apple Touch Icon
    const apple = ["120", "152", "167", "180"].map((size) => ({ type: "png", size, rounding: "0", background: "zinc", accent: "blue" }));

    // SVG
    const svg = { type: "svg", size: "16", background: "zinc", accent: "blue" };

    // Other sizes
    const other = ["16", "160", "180"].map((size) => ({ type: "png", size, background: "zinc", accent: "blue" }));

    return [svg, ...apple, ...other];
};
