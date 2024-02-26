import { type Detail, DetailHandler, Schedule, SSSVT } from "@/classes";
import { bakalari, sssvt, type SSSVTBSON, upload } from "@/db";
import { BakalariParser, SSSVTParser } from "@/parser";
import { parseHTML } from "@/parser/domhandler";
import { BakalariRequest, SSSVTRequest, SSSVTResponse, Week } from "@/request";
import { dayInUTC, formatDate, mondayOfWeek } from "@/util";

/**
 * Fetch and parse a schedule from Bakalari
 * @param week The week of the schedule
 * @param detail The detail of the schedule
 * @param force Force a re-fetch of the schedule
 * @returns The parsed schedule
 */
export async function getBakalari(week: Week, detail: Detail, force = false): Promise<Schedule[]> {
    const rn = new Date();
    const _5minsago = new Date(rn);
    _5minsago.setMinutes(_5minsago.getMinutes() - 5);

    const monday = dayInUTC(mondayOfWeek(rn));
    if (week === Week.Next) monday.setDate(monday.getDate() + 7);

    const friday = new Date(monday);
    friday.setDate(friday.getDate() + 4);

    // Find a stored schedule in the database, that was parsed less than 5 minutes ago
    const schedules =
        !force &&
        (await bakalari
            .find({ date: { $gte: monday, $lte: friday }, detail: `${detail}`, fetchDate: { $gte: _5minsago } }, { limit: 5 })
            .toArray());

    // If stored schedules are found, return them
    if (schedules && schedules.length === 5) return schedules.map((s) => Schedule.fromJSON(s, DetailHandler.instance));

    // Get the html from the bakalari
    const req = new BakalariRequest(week, detail);
    const html = await fetch(req).then((res) => res.text());

    // Upload the html to the database
    await upload(`${formatDate(dayInUTC(rn))}/${detail.name}.html`, html, {
        metadata: { contentType: "text/html", date: rn, scheduleDate: monday, source: "bakalari", detail: detail.id }
    });

    // Parse the schedules and save them
    const parsed = BakalariParser.instance.parse(detail, await parseHTML(html), rn);
    for (const schedule of parsed) {
        schedule.fetchDate = rn;

        await bakalari.updateOne(
            { detail: `${schedule.detail}`, date: schedule.date },
            { $set: schedule as any }, // `.toBSON()` will get called automatically, just doing a type cast
            { upsert: true }
        );
    }

    // Return the parsed schedules
    return parsed;
}

/**
 * Fetch and parse a schedule from SSSVT
 * @param date The date of the schedule
 * @param force Force a re-fetch of the schedule
 * @returns The parsed schedule
 */
export async function getSSSVT(date: Date, force = false): Promise<SSSVT> {
    date = dayInUTC(date);

    const rn = new Date();
    const today = dayInUTC(rn);

    const _15minsago = new Date(rn);
    _15minsago.setMinutes(_15minsago.getMinutes() - 15);

    // Find a stored schedule in the database that was parsed less than 15 minutes ago (unless the date is in the past)
    const schedule =
        !force &&
        (await sssvt.findOne(
            {
                date,
                fetchDate: date < today ? { $exists: true } : { $gte: _15minsago }
            },
            { sort: { fetchDate: -1 } }
        ));

    // If a stored schedule is found, return it
    if (schedule) return SSSVT.fromJSON(schedule, DetailHandler.instance);

    const req = new SSSVTRequest(date);
    const html = await fetch(req)
        // SSSVTResponse decodes the response for us
        .then((res) => new SSSVTResponse(res))

        // Get the html from the response
        .then((res) => res.text());

    // Upload the html to the database
    await upload(`${formatDate(date)}/sssvt.html`, html, {
        metadata: { contentType: "text/html", date: rn, scheduleDate: date, source: "sssvt" }
    });

    // Parse the schedule
    const parsed = SSSVTParser.instance.parse(await parseHTML(html));

    // Update the stored schedule
    await sssvt.updateOne(
        { date: parsed.date },
        { $set: { fetchDate: rn, classes: parsed.classes as SSSVTBSON["classes"] } },
        { upsert: true }
    );

    // Return the parsed schedule
    return parsed;
}
