import { Cron } from "croner";

import { DetailHandler, DetailType } from "@/classes";
import { BakalariRequest, Week } from "@/request";
import save from "@/scheduler/save";

/**
 * Schedule download of all classes from Bakalari every 4 hours and at 23:00.
 *
 * This will always use the Europe/Prague timezone.
 */
async function scheduleAllClasses() {
    // Log that the task has started
    console.log("Scheduling task: AllClasses");

    // Skip Saturdays because there's no school. (Sundays are fetched anyway for archival)
    const task = new Cron("0 0 */4,23 * * 0-5", { name: "AllClasses", timezone: "Europe/Prague" }, async () => {
        // Log the run time and the next run time
        console.log(`Running task "AllClasses" at ${new Date().toLocaleString()}`);
        console.log(` - Next run time for task "AllClasses": ${task.nextRun()?.toLocaleString()}`);

        // Wait 5 to 15 minutes
        const min = Math.random() * 10 + 5;
        // await new Promise((resolve) => setTimeout(resolve, min * 60 * 1000));

        // Fetch the schedules in random order
        const details = DetailHandler.instance.getOfType(DetailType.Class).sort(() => Math.random() - 0.5);
        for (const detail of details) {
            // Fetch the schedule for the detail and save it
            fetch(new BakalariRequest(Week.Current, detail))
                .then((res) => (console.log(res), res.text()))
                .then((html) => save(html, detail.id));

            // Wait between 5 and 10 seconds.
            await new Promise((resolve) => setTimeout(resolve, Math.random() * 5000 + 5000));
        }
    });

    // If the env variable "NOW" is set to true, run the task immediately.
    if (process.env.NOW === "true") await task.trigger();

    // Log the next run time
    console.log(`Next run time for task "AllClasses": ${task.nextRun()?.toLocaleString()}`);
}

export default scheduleAllClasses;
