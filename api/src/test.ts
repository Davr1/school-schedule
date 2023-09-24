import { statSync } from "fs";
import { readdir } from "fs/promises";

import parseBakalari from "@/parser/bakalari";

async function checkDir(dir: string = "../cache/") {
    const files = await readdir(dir);

    for (const file of files) {
        if (statSync(`${dir}/${file}`).isDirectory()) checkDir(`${dir}/${file}`);
        else {
            if (!file.endsWith(".html")) continue;

            const contents = await Bun.file(`${dir}/${file}`).text();
            const parsed = await parseBakalari(contents);

            console.log(parsed);
        }
    }
}

checkDir();
