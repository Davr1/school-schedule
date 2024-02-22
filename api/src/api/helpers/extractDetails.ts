import { Detail, DetailHandler, Schedule, SSSVT } from "@/classes";
import { DetailsParam } from "@/schemas";

/** Extract details from the schedules */
export function extractDetails(schedule: Schedule[] | SSSVT | SSSVT[], wanted?: DetailsParam): Detail[] {
    if (wanted === DetailsParam.All) return DetailHandler.instance.details;

    const predicate = wanted === DetailsParam.Minimal ? undefined : (d: Detail) => !d.static;

    if (schedule instanceof SSSVT) return Array.from(schedule.extractDetails(predicate));
    else if (schedule[0] instanceof Schedule) return Array.from(Schedule.extractDetails(schedule as Schedule[], predicate));
    else return Array.from(SSSVT.extractDetails(schedule as SSSVT[], predicate));
}
