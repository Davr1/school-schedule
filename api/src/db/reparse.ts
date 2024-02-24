/** Delete all data and re-parse it from gridfs */
import { DetailHandler } from "@/classes";
import { bakalari, client, fs, sssvt } from "@/db";
import { BakalariParser, SSSVTParser } from "@/parser";
import { parseHTML } from "@/parser/domhandler";

console.time("Re-parse");

// Remove all data from the collections
await bakalari.deleteMany({});
await sssvt.deleteMany({});

for await (const file of fs.find()) {
    // Read the file contents
    const stream = fs.openDownloadStream(file._id);
    const html = await new Promise<string>((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
        stream.on("error", reject);
    });

    // Get the date and source of the file
    const date = file.metadata!.date as Date;
    const source = file.metadata!.source as "bakalari" | "sssvt";

    // Bakalari
    if (source === "bakalari") {
        const detail = DetailHandler.instance.getOne(file.metadata!.detail as string);
        const schedules = BakalariParser.instance.parse(detail, await parseHTML(html), date);

        // @ts-expect-error - Add the fetch date to the schedules
        for (const schedule of schedules) schedule.fetchDate = date;

        // Insert the schedules (`.toBSON()` will get called automatically, so I'm just doing a type cast)
        await bakalari.insertMany(schedules as any, { ordered: false });
    }

    // SSSVT
    else {
        const schedule = SSSVTParser.instance.parse(await parseHTML(html));

        // Insert the schedule (`.toBSON()` will get called automatically, so I'm just doing a type cast)
        await sssvt.insertOne(schedule as any);
    }
}

console.timeEnd("Re-parse");
client.close();
