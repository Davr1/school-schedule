import { readdir, readFile } from "node:fs/promises";

/**
 * Get the last cached bakalari schedule for the given class
 *
 * @returns The bakalari schedule
 */
export async function GET({ params }) {
    const className = params.class;

    find: {
        // Find the latest cache folder
        const latest = (await readdir("cache"))
            .map((file) => new Date(file))
            .filter((date) => !isNaN(date.getTime()))
            .sort((a, b) => b.getTime() - a.getTime())[0];

        if (!latest) break find;

        const date = [latest.getFullYear(), latest.getMonth() + 1, latest.getDate()].join("-");

        // Try to open the cached response
        try {
            const file = await readFile(`cache/${date}/${className}.html`);

            return new Response(file, {
                headers: {
                    "content-type": "text/plain; charset=utf-8"
                }
            });
        } catch {}
    }

    return new Response("No cache found", {
        status: 404
    });
}
