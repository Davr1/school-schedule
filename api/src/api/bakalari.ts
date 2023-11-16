import { Hono } from "hono";

import { DetailHandler, Details, type ScheduleType } from "@/classes";
import fetchBakalari, { type Week } from "@/loader/bakalari";
import { BakalariParser } from "@/parser";

const details = new DetailHandler();
const bakalariParser = new BakalariParser(details);

const app = new Hono().get("/:mode/:type/:id", async (c) => {
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

export default app;
