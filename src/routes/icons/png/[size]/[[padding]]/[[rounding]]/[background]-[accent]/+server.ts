import { getIconColors, InvalidColorResponse } from "$lib/server/iconColors";
import { renderComponent, renderHTML } from "$lib/server/render";

import Icon from "$components/Icon/Icon.svelte";

export async function GET({ params }) {
    const { background, accent } = params;
    const size = Number(params.size);
    const padding = params.padding ? Number(params.padding) : undefined;
    const rounding = params.rounding ? Number(params.rounding) : undefined;

    const colors = getIconColors(background, accent);
    if (!colors) return new InvalidColorResponse();

    const svg = renderComponent(Icon, {
        padding,
        rounding,
        colors
    });

    return new Response(await renderHTML(svg, size, size), {
        headers: {
            "Content-Type": "image/png"
        }
    });
}
