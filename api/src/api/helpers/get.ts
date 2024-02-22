import type { Detail, Schedule, SSSVT } from "@/classes";
import { BakalariParser, SSSVTParser } from "@/parser";
import { parseHTML } from "@/parser/domhandler";
import { BakalariRequest, SSSVTRequest, Week } from "@/request";

/**
 * Fetch and parse a schedule from Bakalari
 * @param week The week of the schedule
 * @param detail The detail of the schedule
 */
export function getBakalari(week: Week, detail: Detail): Promise<Schedule[]> {
    const req = new BakalariRequest(week, detail);
    return fetch(req)
        .then((res) => res.text())
        .then(parseHTML)
        .then((dom) => BakalariParser.instance.parse(detail, dom));
}

/**
 * Fetch and parse a schedule from SSSVT
 * @param date The date of the schedule
 */
export function getSSSVT(date: Date): Promise<SSSVT> {
    const req = new SSSVTRequest(date);
    return fetch(req)
        .then((res) => res.text())
        .then(parseHTML)
        .then((dom) => SSSVTParser.instance.parse(dom));
}
