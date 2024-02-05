import { OpenAPIHono } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";

import type { ApiContext } from "@/api/context";
import sssvtSubstitutionRoute from "@/api/sssvt/route";
import fetchSSSVT from "@/loader/sssvt";
import { parseHTML } from "@/parser/domhandler";
import type { SSSVTJSON } from "@/schemas";

const SSSVTEndpoints = ({ sssvtParser }: ApiContext) =>
    // Fetch and parse a substitution schedule from SSSVT
    new OpenAPIHono().openapi(sssvtSubstitutionRoute, async (c) => {
        const { date } = c.req.valid("param");

        // Parse the date
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) throw new HTTPException(400, { message: "Invalid date" });

        // Fetch the schedule from the schedule loader
        const html = await fetchSSSVT(parsedDate);

        // Parse the schedule
        const dom = await parseHTML(html);
        const parsed = sssvtParser.parse(dom);

        // Return the schedule (cast as any because toJSON will be called by JSON.stringify)
        return c.jsonT<SSSVTJSON>(parsed as any);
    });

export default SSSVTEndpoints;
