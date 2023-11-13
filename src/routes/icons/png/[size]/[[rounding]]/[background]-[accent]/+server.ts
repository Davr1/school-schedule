import { getIconColors } from "$lib/server/iconColors";
import { renderComponent, renderHTML } from "$lib/server/render";

import Icon from "$components/Icon/Icon.svelte";

export async function GET({ params }) {
    const { background, accent, rounding } = params;
    const size = Number(params.size);

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

    return new Response(await renderHTML(svg, size, size), {
        headers: {
            "Content-Type": "image/png"
        }
    });
}
