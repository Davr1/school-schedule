import log from "@/log";
import { mkdir } from "fs/promises";

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

    log(`Saved ${name}.html`);
}

export default save;
