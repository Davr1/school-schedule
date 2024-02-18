import { OpenAPIHono } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";

import sssvtSubstitutionRoute, { type SSSVTSubstitutionResponse } from "@/api/sssvt/route";
import { type AnyDetail, Detail, DetailHandler } from "@/classes";
import { SSSVTParser } from "@/parser";
import { parseHTML } from "@/parser/domhandler";
import { SSSVTRequest } from "@/request";
import { DetailsParam } from "@/schemas";

const SSSVTEndpoints = new OpenAPIHono()
    // Fetch and parse a substitution schedule from SSSVT
    .openapi(sssvtSubstitutionRoute, async (c) => {
        const { date } = c.req.valid("param");
        const { details } = c.req.valid("query");
        const minify = c.req.query("minify");

        // Parse the date
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) throw new HTTPException(400, { message: "Invalid date" });

        // Fetch and parse the schedule from sssvt
        const req = new SSSVTRequest(parsedDate);
        const sssvt = await fetch(req)
            .then((res) => res.text())
            .then(parseHTML)
            .then((dom) => SSSVTParser.instance.parse(dom));

        // Extract the details from the schedules, depending on the details parameter
        let additionalDetails: AnyDetail[] | undefined;
        if (details === DetailsParam.All) additionalDetails = DetailHandler.instance.details;
        else {
            const predicate = details === DetailsParam.Minimal ? undefined : (d: Detail) => !d.static;

            additionalDetails = Array.from(sssvt.extractDetails(predicate));
        }

        // If minifying is enabled and no additional details are requested, remove the additionalDetails field
        if (minify !== undefined && !additionalDetails.length) additionalDetails = undefined;

        // Return the schedule
        return c.json<SSSVTSubstitutionResponse>({
            date: sssvt.date.toJSON(),
            classes: sssvt.classes as any, // cast as any because toJSON will be called by JSON.stringify
            additionalDetails: additionalDetails?.map((d) => d.toJSON())
        });
    });

export default SSSVTEndpoints;
