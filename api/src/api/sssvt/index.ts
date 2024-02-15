import { OpenAPIHono } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";

import sssvtSubstitutionRoute from "@/api/sssvt/route";
import { SSSVTParser } from "@/parser";
import { parseHTML } from "@/parser/domhandler";
import { SSSVTRequest } from "@/request";
import type { SSSVTJSON } from "@/schemas";

const SSSVTEndpoints = new OpenAPIHono()
    // Fetch and parse a substitution schedule from SSSVT
    .openapi(sssvtSubstitutionRoute, async (c) => {
        // Parse the date
        const { date } = c.req.valid("param");
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) throw new HTTPException(400, { message: "Invalid date" });

        // Fetch and parse the schedule from sssvt
        const req = new SSSVTRequest(parsedDate);
        const res = await fetch(req)
            .then((res) => res.text())
            .then(parseHTML)
            .then((dom) => SSSVTParser.instance.parse(dom));

        // Return the schedule (cast as any because toJSON will be called by JSON.stringify)
        return c.json<SSSVTJSON>(res as any);
    });

export default SSSVTEndpoints;
