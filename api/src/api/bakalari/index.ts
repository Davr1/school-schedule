import { OpenAPIHono } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";

import bakalariScheduleRoute from "@/api/bakalari/route";
import type { ApiContext } from "@/api/context";
import fetchBakalari from "@/loader/bakalari";
import type { ScheduleJSON } from "@/schemas";

const BakalariEndpoints = ({ details, bakalariParser }: ApiContext) =>
    // Fetch and parse a schedule from Bakalari
    new OpenAPIHono().openapi(bakalariScheduleRoute, async (c) => {
        const { week, id } = c.req.valid("param");

        // Find the id in the details
        const detail = details.get(id);
        if (!detail) throw new HTTPException(404, { message: "Detail not found" });

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
        const parsed = await bakalariParser.parse(detail, html);

        // Return the schedule (cast as any because toJSON will be called by JSON.stringify)
        return c.jsonT<ScheduleJSON[]>(parsed as any);
    });

export default BakalariEndpoints;
