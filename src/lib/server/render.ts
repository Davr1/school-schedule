import { promises as dns } from "dns";
import puppeteer, { type Browser } from "puppeteer";
import type { ComponentProps, ComponentType, SvelteComponent } from "svelte";

import { env } from "$env/dynamic/private";

// Declare the global `__puppeteer` variable (to preserve it between HMR reloads)
declare global {
    var __puppeteer: Browser | undefined;
}

/** Get the browser instance */
export async function getBrowser(): Promise<Browser> {
    // Skip the browser launch if it's already running
    // If the environment variable `PUPPETEER_BROWSER_URL` is set, connect to that browser instead of launching a new one
    if (!globalThis.__puppeteer)
        if (env.PUPPETEER_BROWSER_URL) {
            // Parse the URL
            let url = new URL(env.PUPPETEER_BROWSER_URL);

            // Resolve the hostname (Chromium doesn't accept requests whose `Host` header isn't an IP address)
            if (url.hostname !== "localhost") {
                let lookup = await dns.lookup(url.hostname);
                url.hostname = lookup.family === 4 ? lookup.address : `[${lookup.address}]`;
            }

            globalThis.__puppeteer = await puppeteer.connect({ browserURL: url.href });
        } else globalThis.__puppeteer = await puppeteer.launch();

    // In case the browser failed to launch
    if (!globalThis.__puppeteer) throw new Error("Failed to launch puppeteer");
    return globalThis.__puppeteer;
}

/** Render HTML as a png, using headless chromium */
export async function renderHTML(html: string, width: number, height: number): Promise<Buffer> {
    const browser = await getBrowser();
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
    // @ts-expect-error - Svelte components' types don't have a `render` method, even tho the object does
    const { html } = component.render(props);

    return html;
}
