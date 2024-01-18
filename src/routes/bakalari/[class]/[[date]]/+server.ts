import { readdir, readFile } from "node:fs/promises";

/** Find the last cached schedule */
async function getLatestCache() {
    // Find the latest cache folder
    const latest = (await readdir("cache"))
        .map((file) => new Date(file))
        .filter((date) => !isNaN(date.getTime()))
        .sort((a, b) => b.getTime() - a.getTime())[0];

    if (!latest) throw new Error("Couldn't find any caches");

    return latest;
}

/**
 * Get the cached bakalari schedule for the given class and date
 *
 * @returns The bakalari schedule
 */
export async function GET({ params }) {
    const className = params.class;
    const date = params.date ? new Date(params.date) : await getLatestCache();

    // Convert the date to the string format we use
    const name = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join("-");

    // Try to open the cached response
    try {
        const file = await readFile(`cache/${name}/${className}.html`);

        return new Response(file, {
            headers: {
                "content-type": "text/plain; charset=utf-8"
            }
        });
    } catch {}

    return new Response("No cache found", {
        status: 404
    });
}
