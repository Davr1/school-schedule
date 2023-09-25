import { Cron } from "croner";

import { Week } from "@/loader/bakalari";
import fetchAllClasses from "@/loader/bakalari/allClasses";
import log from "@/log";
import save from "@/scheduler/save";

/**
 * Schedule download of all classes from Bakalari at ~11:30 every day.
 *
 * This will always use the Europe/Prague timezone.
 */
async function scheduleAllClasses() {
    // Log that the task has started
    log("Scheduling task: AllClasses");

    // Skip Saturdays because there's no school. (Sundays are fetched anyway for archival)
    const task = new Cron("0 0 */4,23 * * 0-5", { name: "AllClasses", timezone: "Europe/Prague" }, async () => {
        // Log the run time and the next run time
        log(`Running task "AllClasses" at ${new Date().toLocaleString()}`);
        log(` - Next run time for task "AllClasses": ${task.nextRun()?.toLocaleString()}`);

        // Wait 5 to 15 minutes
        const min = Math.random() * 10 + 5;
        await new Promise((resolve) => setTimeout(resolve, min * 60 * 1000));

        // Fetch the schedules.
        const schedules = await fetchAllClasses(Week.Current);

        // Save the schedules.
        for (const [classId, { html }] of Object.entries(schedules)) {
            await save(html, classId);
        }
    });

    // Log the next run time
    log(`Next run time for task "AllClasses": ${task.nextRun()?.toLocaleString()}`);
}

export default scheduleAllClasses;

// If this file was run directly, schedule the task.
if (import.meta.main) scheduleAllClasses();