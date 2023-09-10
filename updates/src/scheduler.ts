import { Cron } from "croner";

/** Schedule all the jobs */
function scheduleJobs(): void {
    // School days
    const school = schoolJobs();

    // Weekends
    const weekend = weekendJobs();
}

export default scheduleJobs;

// Schedule the jobs if this is the main module (otherwise you can just run the main function...)
if (import.meta.main) schoolJobs();

/** School day jobs */
export function schoolJobs(): Cron[] {
    // Early school: every 12 minutes - 8am to 2pm (people end at this time usually)
    const early = new Cron("0 */12 8-13 * * 1-5", { name: "School - Early" });

    // Late school: every 20 minutes - 2pm to 4pm (there's a couple lessons on some days)
    const late = new Cron("0 */20 14-15 * * 1-5", { name: "School - Late" });

    // Day (morning and evening): every 30 minutes - 4pm to 11pm and 6am to 8am
    const day = new Cron("0 */30 6-7,16-22 * * 1-5", { name: "School - Day" });

    // Night - 11pm to 6am: every hour
    const night = new Cron("0 0 23,0-5 * * 1-5", { name: "School - Night" });

    // Return the jobs to run as an array
    return [early, late, day, night];
}

/** Weekend jobs */
export function weekendJobs(): Cron[] {
    // Day: every 45 minutes - 8am to 12am
    const day = new Cron("0 * 8-22 * * 6-7", { name: "Weekend - Day", interval: 45 * 60 });

    // Night: every 90 minutes - 12am to 8am
    const night = new Cron("0 * 0-7 * * 6-7", { name: "Weekend - Night", interval: 90 * 60 });

    // Return the jobs to run as an array
    return [day, night];
}
