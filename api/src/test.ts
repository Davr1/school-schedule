import { statSync } from "fs";
import { readdir } from "fs/promises";

import { DetailHandler, ScheduleType } from "@/classes";
import saveBakalari from "@/database/bakalari/save";
import client, { db } from "@/database/mongo/client";
import { BakalariParser } from "@/parser";

// Remove all documents from all collections
for (const collection of await db.collections()) {
    await collection.deleteMany({});
}

const details = new DetailHandler();
const bakalariParser = new BakalariParser(details);

async function checkDir(dir: string = "../cache/") {
    const files = await readdir(dir);

    for (const file of files) {
        if (statSync(`${dir}/${file}`).isDirectory()) await checkDir(`${dir}/${file}`);
        else {
            if (!file.endsWith(".html")) continue;

            const value = file.split(".")[0];

            const contents = await Bun.file(`${dir}/${file}`).text();
            const parsed = await bakalariParser.parse(ScheduleType.Class, value, contents);

            await saveBakalari(parsed);
        }
    }
}

await checkDir();

await client.close();
