import puppeteer, { type Browser } from "puppeteer";
import type { ComponentProps, ComponentType, SvelteComponent } from "svelte";

// Declare the global `puppeteer` variable
declare global {
    var _puppeteer: Browser;
}

/** Render HTML as a png, using headless chromium */
export async function renderHTML(html: string, width: number, height: number): Promise<Buffer> {
    // Initialize puppeteer if it hasn't been initialized yet
    if (!globalThis._puppeteer) {
        globalThis._puppeteer = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
    }

    const page = await globalThis._puppeteer.newPage();

    // Set the HTML
    await page.setContent(html);
    await page.setViewport({ width, height });

    // Remove default margin
    page.evaluate(() => (document.body.style.margin = "0"));

    // Render the page
    const image = await page.screenshot({ omitBackground: true, optimizeForSpeed: true });

    await page.close();

    return image;
}

/** Render a Svelte component as HTML */
export function renderComponent<T extends SvelteComponent>(component: ComponentType<T>, props: ComponentProps<T>): string {
    // @ts-expect-error - Svelte components' types don't have a `render` method, even the object does
    const { html } = component.render(props);

    return html;
}
