import { BakalariLessonType, NormalBakalariLesson } from "@/classes/bakalari/lesson";
import type { Detail, DetailHandler } from "@/classes/details";
import { type AnyLesson, BaseLesson } from "@/classes/schedule/lesson";
import { SSSVTSubstitution } from "@/classes/sssvt/change";
import type { SSSVTClass } from "@/classes/sssvt/schedule";
import type { ScheduleBSON } from "@/db";
import type { ScheduleJSON } from "@/schemas";

/** Schedule for a day */
class Schedule {
    /** @private Fetch date */
    fetchDate: Date | undefined;

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
        public event: string | null = null
    ) {}

    toJSON(): ScheduleJSON {
        return {
            ...this,
            detail: `${this.detail}`
        } as ScheduleJSON;
    }

    toBSON() {
        return this.toJSON();
    }

    static fromJSON(json: ScheduleJSON | ScheduleBSON, handler: DetailHandler) {
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

    /** Patch the public bakalari schedule with an authenticated one (won't work properly the other way around!) */
    patch(bakalari: Schedule) {
        // Check if the dates are the same
        if (this.date instanceof Date && bakalari.date instanceof Date && this.date.toISOString() !== bakalari.date.toISOString())
            throw new Error("Can't patch different dates");

        // Patch each lesson
        this.periods.forEach((period, index) => {
            period.forEach((lesson) => {
                if (!lesson.bakalari) return;

                // Find the matching lesson in the other schedule
                const otherLesson = bakalari.periods[index]?.find((l) => {
                    const auth = l.bakalari;
                    const pub = lesson.bakalari;

                    if (!auth || !pub || auth.type !== pub.type) return false;

                    // Non-normal lessons
                    if (auth.type !== BakalariLessonType.Normal || pub.type !== BakalariLessonType.Normal) return true;

                    // Compare the details
                    if (auth.subject?.id !== pub.subject?.id || auth.teacher?.id !== pub.teacher?.id || auth.room?.id !== pub.room?.id)
                        return false;

                    // Compare the groups (auth schedules only show 1 group, so we only need to compare the first one)
                    if (pub.groups.length > 0 && !pub.groups.some((g) => g.number === auth.groups[0]?.number)) return false;

                    return true;
                });

                // Patch the lesson
                if (otherLesson) lesson.bakalari.patch(otherLesson.bakalari!);
            });
        });

        // Patch the event
        if (bakalari.event) this.event = bakalari.event;
    }

    extractDetails(predicate?: (detail: Detail) => boolean, thisArg?: any): Set<Detail> {
        return Schedule.extractDetails([this], predicate, thisArg);
    }

    /**
     * Extract all details from schedules
     *
     * @param schedules The schedules to extract the details from
     * @param predicate Predicate to filter the details
     * @param thisArg The value to use as `this` when executing the predicate
     */
    static extractDetails(schedules: Schedule[], predicate?: (detail: Detail) => boolean, thisArg?: any): Set<Detail> {
        const details = new Set<Detail>();

        function add(detail: Detail) {
            if (predicate && !predicate.call(thisArg, detail)) return;
            details.add(detail);
        }

        for (const schedule of schedules) {
            add(schedule.detail);

            for (const period of schedule.periods)
                for (const lesson of period) {
                    if (lesson.bakalari instanceof NormalBakalariLesson) {
                        const { subject, teacher, room, groups } = lesson.bakalari;

                        if (subject) add(subject);
                        if (teacher) add(teacher);
                        if (room) add(room);
                        groups.forEach((group) => group.class && add(group.class));
                    }

                    if (lesson.sssvt instanceof SSSVTSubstitution) {
                        const { subject, teacher, room } = lesson.sssvt;

                        if (subject) add(subject);
                        if (teacher) add(teacher);
                        if (room) add(room);
                    }
                }
        }
        return details;
    }
}

export default Schedule;
