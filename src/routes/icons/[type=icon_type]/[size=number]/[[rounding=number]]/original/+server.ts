import { renderComponent, renderSVG } from "$lib/server/render";

import Icon from "$components/Icon/Icon.svelte";

export function GET({ params }) {
    const { type, size, rounding } = params;

    const svg = renderComponent(Icon, {
        size,
        rounding: rounding !== undefined ? Number(rounding) : undefined,
        colors: {
            BG: "#2c3138",
            FG: "#4c555e",
            Accent: "#1f6feb"
        }
    });

    return new Response(type === "png" ? renderSVG(svg).asPng() : svg, {
        headers: {
            "Content-Type": type === "png" ? "image/png" : "image/svg+xml"
        }
    });
}
