import { Hono } from "hono";

import type { ApiContext } from "@/api/context";
import { Details, DetailsType, type ScheduleJSON, type ScheduleType } from "@/classes";
import fetchBakalari, { Week } from "@/loader/bakalari";

const BakalariEndpoints = ({ details, bakalariParser }: ApiContext) =>
    // Fetch and parse a schedule from Bakalari
    new Hono().get("/:mode/:type/:id", async (c) => {
        // Fetch the schedule from the schedule loader
        const { mode, type, id } = c.req.param();
        const { html } = await fetchBakalari(mode as Week, type as ScheduleType, id);

        // Find the id in the details
        const detail = details.getDetail(id, () => new Details(DetailsType.Other, id, null));

        // Parse the schedule
        const parsed = await bakalariParser.parse(type as ScheduleType, detail, html);

        // Return the schedule (cast as any because toJSON will be called by JSON.stringify)
        return c.jsonT<ScheduleJSON[]>(parsed as any);
    });

export default BakalariEndpoints;
