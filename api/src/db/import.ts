/** Import all files from the old directory format to the new database */
import { deserialize } from "bson";
import { readdir, readFile } from "fs/promises";
import { join } from "path";
import { promisify } from "util";
import { gunzip } from "zlib";

import { DetailHandler } from "@/classes";
import { client, fs } from "@/db";

const gunZip = promisify(gunzip);

const path = process.env.IMPORT_PATH ?? "cache";

console.time("Import");

const items = await readdir(path);
for (const item of items) {
    if (item === ".DS_Store" || item.endsWith(".html")) continue;
    const itemPath = join(path, item);

    // SSSVT import
    if (item.endsWith(".bson")) {
        const contents = deserialize(await gunZip(await readFile(itemPath)));
        const date = new Date(contents.timestamp);
        if (!contents.response) continue;

        const name = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}/sssvt.html`;
        const upload = fs.openUploadStream(name, {
            metadata: { contentType: "text/html", date, source: "sssvt" }
        });

        upload.end(contents.response);
    }

    // Bakalari import
    else
        for (const file of await readdir(itemPath)) {
            if (file === ".DS_Store") continue;

            const id = file.replace(".html", "");
            const detail = DetailHandler.instance.getOne(id);
            const date = new Date(item);

            // Read the file and upload it to the database
            const contents = await readFile(join(itemPath, file), "utf-8");
            const name = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}/${detail.name}.html`;
            const upload = fs.openUploadStream(name, { metadata: { date, contentType: "text/html", source: "bakalari", detail: id } });

            upload.end(contents);
        }
}

console.timeEnd("Import");
client.close();
