import { OpenAPIHono } from "@hono/zod-openapi";

import bakalariScheduleRoute, { type BakalariScheduleResponse } from "@/api/bakalari/route";
import { type AnyDetail, type Detail, DetailHandler, Schedule } from "@/classes";
import { BakalariParser } from "@/parser";
import { parseHTML } from "@/parser/domhandler";
import { BakalariRequest } from "@/request";
import { DetailsParam } from "@/schemas";

const BakalariEndpoints = new OpenAPIHono()
    // Fetch and parse a schedule from Bakalari
    .openapi(bakalariScheduleRoute, async (c) => {
        const { week, id } = c.req.valid("param");
        const { details } = c.req.valid("query");
        const minify = c.req.query("minify");

        // Find the id in the details
        const detail = DetailHandler.instance.getOne(id);

        // Fetch and parse the schedule from bakalari
        const req = new BakalariRequest(week, detail);
        const schedules = await fetch(req)
            .then((res) => res.text())
            .then(parseHTML)
            .then((dom) => BakalariParser.instance.parse(detail, dom));

        // Extract the details from the schedules, depending on the details parameter
        let additionalDetails: AnyDetail[] | undefined;
        if (details === DetailsParam.All) additionalDetails = DetailHandler.instance.details;
        else {
            const predicate = details === DetailsParam.Minimal ? undefined : (d: Detail) => !d.static;

            additionalDetails = Array.from(Schedule.extractDetails(schedules, predicate));
        }

        // If minifying is enabled and no additional details are requested, remove the additionalDetails field
        if (minify !== undefined && !additionalDetails.length) additionalDetails = undefined;

        return c.json<BakalariScheduleResponse>({
            schedules: schedules.map((s) => s.toJSON()),
            additionalDetails: additionalDetails?.map((d) => d.toJSON())
        });
    });

export default BakalariEndpoints;
