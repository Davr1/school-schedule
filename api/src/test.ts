import { statSync } from "fs";
import { readdir } from "fs/promises";

import { DetailHandler, Details, ScheduleType } from "@/classes";
import { BakalariParser } from "@/parser";

const details = new DetailHandler();
const bakalariParser = new BakalariParser(details);

async function checkDir(dir: string = "../cache/") {
    const files = await readdir(dir);

    for (const file of files) {
        if (statSync(`${dir}/${file}`).isDirectory()) await checkDir(`${dir}/${file}`);
        else {
            if (!file.endsWith(".html")) continue;

            const id = file.split(".")[0];
            const detail = details.getDetail(id, () => new Details(id));

            const contents = await Bun.file(`${dir}/${file}`).text();
            const parsed = await bakalariParser.parse(ScheduleType.Class, detail, contents);

            console.log(parsed);
        }
    }
}

await checkDir();

console.log(details.details);
