import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

import type { ApiContext } from "@/api/context";
import { type ScheduleJSON } from "@/classes";
import fetchBakalari, { Week } from "@/loader/bakalari";

const BakalariEndpoints = ({ details, bakalariParser }: ApiContext) =>
    // Fetch and parse a schedule from Bakalari
    new Hono().get("/:mode/:id", async (c) => {
        const { mode, id } = c.req.param();

        // Find the id in the details
        const detail = details.get(id);
        if (!detail) throw new HTTPException(404, { message: "Detail not found" });

        // Fetch the schedule from the schedule loader
        let html: string;
        try {
            html = (await fetchBakalari(mode as Week, detail)).html;
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
