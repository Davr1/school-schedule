import { OpenAPIHono } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";

import mergedScheduleRoute, { type MergedScheduleResponse } from "@/api/merge/route";
import { type AnyDetail, Detail, DetailHandler, DetailType, Schedule } from "@/classes";
import { BakalariParser, SSSVTParser } from "@/parser";
import { parseHTML } from "@/parser/domhandler";
import { BakalariRequest, SSSVTRequest, Week } from "@/request";
import { DetailsParam } from "@/schemas";

const MergedEndpoints = new OpenAPIHono()
    // Merge a bakalari and sssvt schedule
    .openapi(mergedScheduleRoute, async (c) => {
        const { week, id } = c.req.valid("param");
        const { details } = c.req.valid("query");
        const minify = c.req.query("minify");

        // Find the id in the details
        const detail = DetailHandler.instance.getOne(id);
        if (detail.type !== DetailType.Class) throw new HTTPException(400, { message: "Unsupported schedule type" });
        if (detail.name === null) throw new HTTPException(500, { message: "Invalid class" });

        // Get the week dates
        const sunday = new Date();
        sunday.setDate(sunday.getDate() - sunday.getDay());

        if (week === Week.Next) sunday.setDate(sunday.getDate() + 7);

        // Fetch substitutions from SSSVT
        const sssvt = [1, 2, 3, 4, 5].map((i) => {
            const date = new Date(sunday);
            date.setDate(date.getDate() + i);

            const req = new SSSVTRequest(date);
            return fetch(req)
                .then((res) => res.text())
                .then(parseHTML)
                .then((dom) => SSSVTParser.instance.parse(dom));
        });

        // Fetch and parse the schedule from bakalari
        const req = new BakalariRequest(week, detail);
        const bakalari = await fetch(req)
            .then((res) => res.text())
            .then(parseHTML)
            .then((dom) => BakalariParser.instance.parse(detail, dom));

        // Merge the schedules
        await Promise.all(bakalari.map(async (schedule, i) => schedule.merge((await sssvt[i]).classes[detail.name!])));

        // Extract the details from the schedules, depending on the details parameter
        let additionalDetails: AnyDetail[] | undefined;
        if (details === DetailsParam.All) additionalDetails = DetailHandler.instance.details;
        else {
            const predicate = details === DetailsParam.Minimal ? undefined : (d: Detail) => !d.static;

            additionalDetails = Array.from(Schedule.extractDetails(bakalari, predicate));
        }

        // If minifying is enabled and no additional details are requested, remove the additionalDetails field
        if (minify !== undefined && !additionalDetails.length) additionalDetails = undefined;

        // Return the schedule (cast as any because toJSON will be called by JSON.stringify)
        return c.json<MergedScheduleResponse>({
            schedules: bakalari.map((s) => s.toJSON()),
            additionalDetails: additionalDetails?.map((d) => d.toJSON())
        });
    });

export default MergedEndpoints;
