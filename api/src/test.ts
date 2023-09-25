import { statSync } from "fs";
import { readdir } from "fs/promises";

import saveBakalari from "@/database/bakalari/save";
import client, { db } from "@/database/mongo";
import parseBakalari from "@/parser/bakalari";

await db.dropDatabase();

async function checkDir(dir: string = "../cache/") {
    const files = await readdir(dir);

    for (const file of files) {
        if (statSync(`${dir}/${file}`).isDirectory()) await checkDir(`${dir}/${file}`);
        else {
            if (!file.endsWith(".html")) continue;

            const contents = await Bun.file(`${dir}/${file}`).text();
            const parsed = await parseBakalari(contents);

            await saveBakalari(parsed);
        }
    }
}

await checkDir();

await client.close();
