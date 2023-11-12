import { getIconColors } from "$lib/server/iconColors";
import { renderComponent, renderSVG } from "$lib/server/render";

import Icon from "$components/Icon/Icon.svelte";

export function GET({ params }) {
    const { background, accent, size, rounding } = params;

    const colors = getIconColors(background, accent);

    if (!colors)
        return new Response(`Invalid colors`, {
            status: 400,
            headers: { "Content-Type": "text/plain" }
        });

    const svg = renderComponent(Icon, {
        size,
        colors,
        rounding: rounding !== undefined ? Number(rounding) : undefined
    });

    return new Response(renderSVG(svg).asPng(), {
        headers: {
            "Content-Type": "image/png"
        }
    });
}
