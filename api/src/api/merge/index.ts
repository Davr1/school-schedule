import { OpenAPIHono } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";

import mergedScheduleRoute from "@/api/merge/route";
import { DetailHandler, DetailType } from "@/classes";
import fetchBakalari from "@/loader/bakalari";
import fetchSSSVT from "@/loader/sssvt";
import { BakalariParser, SSSVTParser } from "@/parser";
import { parseHTML } from "@/parser/domhandler";
import type { ScheduleJSON } from "@/schemas";

const MergedEndpoints = new OpenAPIHono()
    // Merge a bakalari and sssvt schedule
    .openapi(mergedScheduleRoute, async (c) => {
        const { week, id } = c.req.valid("param");

        // Find the id in the details
        const detail = DetailHandler.instance.getOne(id);
        if (detail.type !== DetailType.Class) throw new HTTPException(400, { message: "Unsupported schedule type" });
        if (detail.name === null) throw new HTTPException(500, { message: "Invalid class" });

        // Fetch the schedule from the schedule loader and parse it
        const parsed = await fetchBakalari(week, detail)
            .then(({ html }) => parseHTML(html))
            .then((dom) => BakalariParser.instance.parse(detail, dom))
            .then((schedule) =>
                schedule.map(async (day) => {
                    // Fetch substitutions from SSSVT
                    const sssvt = await fetchSSSVT(day.date as Date)
                        .then((html) => parseHTML(html))
                        .then((dom) => SSSVTParser.instance.parse(dom));

                    // Try to find the class in the SSSVT schedule
                    const sssvtClass = sssvt.classes[detail.name!];

                    // Merge the schedules (if the class was found)
                    if (sssvtClass) day.merge(sssvtClass);
                    return day;
                })
            )
            .then((p) => Promise.all(p)); // i'm not doing `Promise.all` cuz typescript was having issues with it

        // Return the schedule (cast as any because toJSON will be called by JSON.stringify)
        return c.json<ScheduleJSON[]>(parsed as any);
    });

export default MergedEndpoints;
