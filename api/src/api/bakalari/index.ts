import { OpenAPIHono } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";

import bakalariScheduleRoute from "@/api/bakalari/route";
import { DetailHandler } from "@/classes";
import fetchBakalari from "@/loader/bakalari";
import { BakalariParser } from "@/parser";
import { parseHTML } from "@/parser/domhandler";
import type { ScheduleJSON } from "@/schemas";

const BakalariEndpoints = new OpenAPIHono()
    // Fetch and parse a schedule from Bakalari
    .openapi(bakalariScheduleRoute, async (c) => {
        const { week, id } = c.req.valid("param");

        // Find the id in the details
        const detail = DetailHandler.instance.getOne(id);

        // Fetch the schedule from the schedule loader
        let html: string;
        try {
            html = (await fetchBakalari(week, detail)).html;
        } catch (e) {
            // If the error is a TypeError, it means that the input was invalid
            if (e instanceof TypeError) throw new HTTPException(400, { message: e.message });

            // Otherwise, it's a server error ig
            throw new HTTPException(500, { message: "Failed to fetch schedule" });
        }

        // Parse the schedule
        const dom = await parseHTML(html);
        const parsed = BakalariParser.instance.parse(detail, dom);

        // Return the schedule (cast as any because toJSON will be called by JSON.stringify)
        return c.json<ScheduleJSON[]>(parsed as any);
    });

export default BakalariEndpoints;
