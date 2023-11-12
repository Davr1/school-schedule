import { type RenderedImage, Resvg } from "@resvg/resvg-js";
import type { ComponentProps, ComponentType, SvelteComponent } from "svelte";

/** Render an SVG as an image */
export function renderSVG(svg: string): RenderedImage {
    const resvg = new Resvg(svg);

    return resvg.render();
}

/** Render a Svelte component as HTML */
export function renderComponent<T extends SvelteComponent>(component: ComponentType<T>, props: ComponentProps<T>): string {
    // @ts-expect-error - Svelte components' types don't have a `render` method, even the object does
    const { html } = component.render(props);

    return html;
}
