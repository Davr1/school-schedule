import { statSync } from "fs";
import { readdir } from "fs/promises";

import context from "@/api/context";
import { parseHTML } from "@/parser";

const { details, bakalariParser } = context;

async function checkDir(dir: string = "../cache/") {
    const files = await readdir(dir);

    for (const file of files) {
        if (statSync(`${dir}/${file}`).isDirectory()) await checkDir(`${dir}/${file}`);
        else {
            if (!file.endsWith(".html")) continue;

            const id = file.split(".")[0];
            const detail = details.get(id);
            if (!detail) continue;

            const contents = await Bun.file(`${dir}/${file}`).text();
            const dom = await parseHTML(contents);
            const parsed = await bakalariParser.parse(detail, dom);

            console.log(parsed, {});
        }
    }
}

await checkDir();

// console.log(details.details);
