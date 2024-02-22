import { OpenAPIHono } from "@hono/zod-openapi";

import bakalariScheduleRoute, { type BakalariScheduleResponse } from "@/api/bakalari/route";
import { extractDetails } from "@/api/helpers/extractDetails";
import { getBakalari } from "@/api/helpers/get";
import { DetailHandler } from "@/classes";

const BakalariEndpoints = new OpenAPIHono()
    // Fetch and parse a schedule from Bakalari
    .openapi(bakalariScheduleRoute, async (c) => {
        const { week, id } = c.req.valid("param");
        const { details } = c.req.valid("query");
        const minify = c.req.query("minify");

        // Find the id in the details
        const detail = DetailHandler.instance.getOne(id);

        // Get the schedules and extract details
        const schedules = await getBakalari(week, detail);
        const additionalDetails = extractDetails(schedules, details);

        // Return the schedule
        return c.json<BakalariScheduleResponse>({
            schedules: schedules.map((s) => s.toJSON()),

            // If minifying is enabled and no additional details are requested, remove the additionalDetails field
            additionalDetails: minify !== undefined && !additionalDetails.length ? undefined : additionalDetails.map((d) => d.toJSON())
        });
    });

export default BakalariEndpoints;
