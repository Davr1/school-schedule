import puppeteer, { type Browser } from "puppeteer";
import type { ComponentProps, ComponentType, SvelteComponent } from "svelte";

// Declare the global `puppeteer` variable
declare global {
    var _puppeteer: Promise<Browser>;
}

/** Headless chromium */
export const chromium = globalThis._puppeteer ?? puppeteer.launch({ headless: "new" });
globalThis._puppeteer = chromium; // this is to avoid multiple instances of chromium being launched when in dev

/** Render HTML as a png, using headless chromium */
export async function renderHTML(html: string, width: number, height: number): Promise<Buffer> {
    const browser = await chromium;
    const page = await browser.newPage();

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
