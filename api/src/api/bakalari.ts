import { Hono } from "hono";

import type { ApiContext } from "@/api/context";
import { Details, type ScheduleType } from "@/classes";
import fetchBakalari, { Week } from "@/loader/bakalari";

const BakalariEndpoints = ({ details, bakalariParser }: ApiContext) =>
    // Fetch and parse a schedule from Bakalari
    new Hono().get("/:mode/:type/:id", async (c) => {
        // Fetch the schedule from the schedule loader
        const { mode, type, id } = c.req.param();
        const { html } = await fetchBakalari(mode as Week, type as ScheduleType, id);

        // Find the id in the details
        const detail = details.getDetail(id, () => new Details(id));

        // Parse the schedule
        const parsed = await bakalariParser.parse(type as ScheduleType, detail, html);

        // Return the schedule
        return c.json(parsed);
    });

export default BakalariEndpoints;
