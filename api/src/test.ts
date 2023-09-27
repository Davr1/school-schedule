import { statSync } from "fs";
import { readdir } from "fs/promises";

import saveBakalari from "@/database/bakalari/save";
import client, { db } from "@/database/mongo/client";
import parseBakalari from "@/parser/bakalari";

// Remove all documents from all collections
for (const collection of await db.collections()) {
    await collection.deleteMany({});
}

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
