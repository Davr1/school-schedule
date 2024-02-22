import { OpenAPIHono } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";

import { extractDetails } from "@/api/helpers/extractDetails";
import { getSSSVT } from "@/api/helpers/get";
import { getWeek } from "@/api/helpers/getWeek";
import sssvtSubstitutionRoute, { type SSSVTSubstitutionResponse } from "@/api/sssvt/day";
import sssvtWeekSubstitutionRoute, { type SSSVTWeekSubstitutionResponse } from "@/api/sssvt/week";

const SSSVTEndpoints = new OpenAPIHono()
    // Fetch and parse a substitution schedule from SSSVT
    .openapi(sssvtSubstitutionRoute, async (c) => {
        const { date } = c.req.valid("param");
        const { details } = c.req.valid("query");
        const minify = c.req.query("minify");

        // Parse the date
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) throw new HTTPException(400, { message: "Invalid date" });

        // Get the schedule from SSSVT and extract details
        const sssvt = await getSSSVT(parsedDate);
        const additionalDetails = extractDetails(sssvt, details);

        // Return the schedule
        return c.json<SSSVTSubstitutionResponse>({
            date: sssvt.date.toJSON(),
            classes: sssvt.classes as any, // cast as any because toJSON will be called by JSON.stringify

            // If minifying is enabled and no additional details are requested, remove the additionalDetails field
            additionalDetails: minify !== undefined && !additionalDetails.length ? undefined : additionalDetails?.map((d) => d.toJSON())
        });
    })

    .openapi(sssvtWeekSubstitutionRoute, async (c) => {
        const { week } = c.req.valid("param");
        const { details } = c.req.valid("query");
        const minify = c.req.query("minify");

        // Fetch substitutions from SSSVT
        const sunday = getWeek(week);
        const sssvt = await Promise.all(
            [1, 2, 3, 4, 5].map((i) => {
                const date = new Date(sunday);
                date.setDate(date.getDate() + i);

                return getSSSVT(date);
            })
        );

        // Extract the details from the schedules, depending on the details parameter
        const additionalDetails = extractDetails(sssvt, details);

        // Return the schedule
        return c.json<SSSVTWeekSubstitutionResponse>({
            schedules: sssvt as any, // cast as any because toJSON will be called by JSON.stringify

            // If minifying is enabled and no additional details are requested, remove the additionalDetails field
            additionalDetails: minify !== undefined && !additionalDetails.length ? undefined : additionalDetails.map((d) => d.toJSON())
        });
    });

export default SSSVTEndpoints;
