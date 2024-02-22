import { OpenAPIHono } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";

import { extractDetails } from "@/api/helpers/extractDetails";
import { getBakalari, getSSSVT } from "@/api/helpers/get";
import { getWeek } from "@/api/helpers/getWeek";
import mergedScheduleRoute, { type MergedScheduleResponse } from "@/api/merge/route";
import { DetailHandler, DetailType } from "@/classes";

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

        // Fetch substitutions from SSSVT
        const sunday = getWeek(week);
        const sssvt = [1, 2, 3, 4, 5].map((i) => {
            const date = new Date(sunday);
            date.setDate(date.getDate() + i);

            return getSSSVT(date);
        });

        // Get the schedule from Bakalari
        const bakalari = await getBakalari(week, detail);

        // Merge the schedules and extract details
        await Promise.all(bakalari.map(async (schedule, i) => schedule.merge((await sssvt[i]).classes[detail.name!])));
        const additionalDetails = extractDetails(bakalari, details);

        // Return the schedule
        return c.json<MergedScheduleResponse>({
            schedules: bakalari.map((s) => s.toJSON()),

            // If minifying is enabled and no additional details are requested, remove the additionalDetails field
            additionalDetails: minify !== undefined && !additionalDetails.length ? undefined : additionalDetails.map((d) => d.toJSON())
        });
    });

export default MergedEndpoints;
