import { Week } from "@school-schedule/api/request";

export function match(week) {
    // Capitalize the first letter and lowercase the rest, cuz that's what it's called in the enum
    week = week[0].toUpperCase() + week.slice(1).toLowerCase();

    // This is what bakalari calls it for some reason...
    if (week === "Actual") return true;

    return week in Week;
}
