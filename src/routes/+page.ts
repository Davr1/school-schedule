import { Detail, DetailHandler, Schedule } from "@school-schedule/api/classes";
import { BakalariParser } from "@school-schedule/api/parser";
import type { DetailJSON, ScheduleJSON } from "@school-schedule/api/schemas";

import { browser } from "$app/environment";

const parser = browser ? new DOMParser() : null;

const details = new DetailHandler();
const bk = new BakalariParser(details);

export async function load({ fetch }) {
    const scheduleJSON = await fetch("https://rozvrh-v3.icy.cx/api/bakalari/Actual/UE").then<ScheduleJSON[]>((res) => res.json());

    await fetch("https://rozvrh-v3.icy.cx/api/details/Subject")
        .then<DetailJSON[]>((res) => res.json())
        .then((json) => json.forEach((d) => details.set(d.id, Detail.fromJSON(d))));

    const schedule = scheduleJSON.map((s) => Schedule.fromJSON(s, details));

    return { schedule };
}
