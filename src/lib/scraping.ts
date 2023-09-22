import { load } from "cheerio";

import { fetchBaka } from "$lib/data";
import { EmptySubject, SpecialSubject, StandardSubject, Subject } from "$lib/subject";

import type { ScheduleParams } from "$stores/config";
import { toBakaParams } from "$stores/static";

export interface BakalariDay {
    date: readonly [string, string];
    subjects: readonly Subject[][];
}

export type BakalariSchedule = BakalariDay[];

export async function getBakaSchedule(params: ScheduleParams): Promise<BakalariSchedule> {
    const newParams = toBakaParams(params);
    const response = await fetchBaka(newParams);

    const $ = load(response);

    // The schedule is stored in a (strange) table, so we can iterate over the rows
    const schedule: BakalariSchedule = [];

    $(".bk-timetable-row").each((i, row) => {
        const date = [$(row).find(".bk-day-day").text(), $(row).find(".bk-day-date").text()] as const;
        const subjects: Subject[][] = [];

        $(row)
            .find(".bk-timetable-cell")
            .each((_, cell) => {
                // Note: This is an array because there can be multiple lessons at the same time
                // Therefore the array at the top is a 2D array
                const subject: Subject[] = [];

                $(cell)
                    .find(".day-item-hover")
                    .each((_, group) => {
                        // Get the value of the data-detail attribute and parse it as JSON
                        const detail = $(group).data("detail") as any;

                        // If detail is null or undefined, then the lesson is empty and we can skip it
                        if (!detail) return;

                        // TODO: The naming is a bit confusing, maybe change it?
                        let subjectInstance: Subject;

                        switch (detail.type) {
                            case "removed":
                                subjectInstance = new EmptySubject({
                                    changed: true,
                                    changeInfo: detail.removedinfo
                                });
                                break;
                            case "absent":
                                subjectInstance = new SpecialSubject({
                                    special: detail.InfoAbsentName,
                                    specialAbbr: detail.absentinfo,
                                    changeInfo: detail.removedinfo
                                });
                                break;
                            default:
                                subjectInstance = new StandardSubject({
                                    subject: detail.subjecttext.split("|")[0].trim(),
                                    abbreviation: $(group).find(".middle")?.text(),
                                    teacher: { name: detail.teacher, abbreviation: $(group).find(".bottom>span")?.text() ?? "" },
                                    room: detail.room,
                                    groups: [detail.group],
                                    theme: detail.theme,
                                    changed: $(group).hasClass("pink"),
                                    changeInfo: detail.changeinfo
                                });
                        }

                        subject.push(subjectInstance);
                    });

                if (cell.children.length === 0) {
                    subject.push(new EmptySubject({}));
                }

                if ($(cell).find(".empty").length !== 0) {
                    subject.push(
                        new SpecialSubject({
                            special: $(cell).find("span")?.text()
                        })
                    );
                }

                subjects.push(subject);
            });

        schedule.push({ subjects, date });
    });

    return schedule;
}

/**
 * Fetches and parses the schedule from the web
 *
 * NOTE: This seriously needs to be refactored. This is a mess.
 * @param date The date to fetch the schedule for
 * @returns A list of lessons for each class
 */
export async function getWebSchedule(date: Date) {
    throw new Error("Not implemented");
}
