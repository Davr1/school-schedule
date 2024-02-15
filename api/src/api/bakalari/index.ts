import { OpenAPIHono } from "@hono/zod-openapi";

import bakalariScheduleRoute from "@/api/bakalari/route";
import { DetailHandler } from "@/classes";
import { BakalariParser } from "@/parser";
import { parseHTML } from "@/parser/domhandler";
import { BakalariRequest } from "@/request";
import type { ScheduleJSON } from "@/schemas";

const BakalariEndpoints = new OpenAPIHono()
    // Fetch and parse a schedule from Bakalari
    .openapi(bakalariScheduleRoute, async (c) => {
        const { week, id } = c.req.valid("param");

        // Find the id in the details
        const detail = DetailHandler.instance.getOne(id);

        // Fetch and parse the schedule from bakalari
        const req = new BakalariRequest(week, detail);
        const res = await fetch(req)
            .then((res) => res.text())
            .then(parseHTML)
            .then((dom) => BakalariParser.instance.parse(detail, dom));

        // Return the schedule (cast as any because toJSON will be called by JSON.stringify)
        return c.json<ScheduleJSON[]>(res as any);
    });

export default BakalariEndpoints;
