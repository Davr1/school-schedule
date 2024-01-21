import type { Detail, DetailHandler } from "@/classes/details";
import { type AnyLesson, BaseLesson } from "@/classes/schedule/lesson";
import type { SSSVTClass } from "@/classes/sssvt/schedule";
import type { ScheduleJSON } from "@/schemas";

/** Schedule for a day */
class Schedule {
    get day() {
        return this.date instanceof Date ? this.date.getDay() : this.date;
    }

    constructor(
        /** Schedule detail */
        readonly detail: Detail,

        /**
         * The date of the day
         *
         * For permanent schedules this will be the day index (a number between 0 and 6)
         */
        readonly date: Date | number,

        /** The periods of the day */
        readonly periods: AnyLesson[][],

        /** Possible full day event */
        readonly event: string | null = null
    ) {}

    /** Serialize the schedule to JSON */
    toJSON(): ScheduleJSON {
        const detail = this.detail.toString();
        const date = this.date instanceof Date ? this.date.toISOString() : this.date;

        return { ...this, detail, date } as ScheduleJSON;
    }

    /** Deserialize the schedule from JSON */
    static fromJSON(json: ScheduleJSON, handler: DetailHandler) {
        // Find the detail by id
        const detail = handler.getOne(json.detail);

        // Parse the date
        const date = typeof json.date === "string" ? new Date(json.date) : json.date;

        // Parse each lesson in the periods
        const periods = json.periods.map((period) => period.map((lesson) => BaseLesson.fromJSON(lesson, handler)));

        return new Schedule(detail, date, periods, json.event);
    }

    /** Merge a class Bakalari schedule with a SSSVT class substituion schedule */
    merge(sssvt: SSSVTClass) {
        this.periods.forEach((period, index) => {
            // Get the SSSVT equivalent of the period
            const sssvtPeriod = sssvt[index] ?? [];

            // Match the lessons by group
            const newPeriod: AnyLesson[] = [];
            period.forEach((lesson, index) => {
                const { bakalari } = lesson;
                if (!bakalari) return;

                // Find the matching SSSVT lesson
                const sssvtLesson = bakalari?.isNormal()
                    ? sssvtPeriod.find((s) => !s.group || s.group === bakalari.groups[0]?.number)
                    : sssvtPeriod[index];

                // Create the new merged lesson
                newPeriod.push(BaseLesson.merge(bakalari, sssvtLesson));
            });

            // Find the SSSVT lessons that don't have a matching bakalari lesson
            sssvtPeriod.forEach((lesson) => {
                // Try to find this inside the merged lessons
                const mergedLesson = newPeriod.find((l) => l.sssvt === lesson);

                // If there's no merged lesson, add it
                if (!mergedLesson) newPeriod.push(BaseLesson.merge(null, lesson));
            });

            // Replace the period
            this.periods[index] = newPeriod;
        });
    }
}

export default Schedule;
