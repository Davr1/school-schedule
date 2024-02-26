/** Delete all data and re-parse it from gridfs */
import { DetailHandler } from "@/classes";
import { bakalari, client, files, fs, sssvt } from "@/db";
import { BakalariParser, SSSVTParser } from "@/parser";
import { parseHTML } from "@/parser/domhandler";

console.time("Re-parse");

// Remove all data from the collections
await bakalari.deleteMany({});
await sssvt.deleteMany({});

// Get latest schedules from gridfs (we don't want to re-parse the same old data)
const latest = files.aggregate([
    { $sort: { "metadata.date": -1 } },
    {
        $group: {
            _id: { source: "$metadata.source", scheduleDate: "$metadata.scheduleDate", detail: "$metadata.detail" },
            __id: { $first: "$_id" },
            metadata: { $first: "$metadata" }
        }
    },
    { $project: { _id: "$__id", metadata: 1 } }
]);

for await (const file of latest) {
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

        // Add the fetch date to the schedules
        for (const schedule of schedules) schedule.fetchDate = date;

        // Insert the schedules (`.toBSON()` will get called automatically, so I'm just doing a type cast)
        await bakalari.insertMany(schedules as any, { ordered: false });
    }

    // SSSVT
    else {
        const schedule = SSSVTParser.instance.parse(await parseHTML(html));

        // Add the fetch date to the schedule
        schedule.fetchDate = date;

        // Insert the schedule (`.toBSON()` will get called automatically, so I'm just doing a type cast)
        await sssvt.insertOne(schedule as any);
    }
}

console.timeEnd("Re-parse");
client.close();
