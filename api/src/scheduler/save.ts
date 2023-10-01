import { mkdir } from "node:fs/promises";

import { Bakalari, BakalariType } from "@/classes";
import saveBakalari from "@/database/bakalari/save.ts";
import log from "@/log";
import parseBakalari from "@/parser/bakalari/parse";

/**
 * Save the request to a cache
 * ("/cache/*" in cwd)
 */
export async function save(text: string, name: string) {
    const date = new Date();
    const dateText = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    // Make sure the folder with today's date exists.
    await mkdir(`./cache/${dateText}`, { recursive: true });

    // Save the file.
    await Bun.write(`./cache/${dateText}/${name}.html`, text);

    // Try parsing the file and saving it to the database.
    try {
        const schedule = await parseBakalari(text);

        await saveBakalari(new Bakalari(BakalariType.Class, name, schedule));
    } catch (error) {
        log(`Failed to parse ${name}.html`);
        console.error(error);
    }

    log(`Saved ${name}.html`);
}

export default save;
