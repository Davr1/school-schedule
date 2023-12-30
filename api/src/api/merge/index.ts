import { OpenAPIHono } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";

import type { ApiContext } from "@/api/context";
import mergedScheduleRoute from "@/api/merge/route";
import { DetailType } from "@/classes";
import fetchBakalari from "@/loader/bakalari";
import fetchSSSVT from "@/loader/sssvt";
import type { ScheduleJSON } from "@/schemas";

const MergedEndpoints = ({ details, bakalariParser, sssvtParser }: ApiContext) =>
    // Merge a bakalari and sssvt schedule
    new OpenAPIHono().openapi(mergedScheduleRoute, async (c) => {
        const { week, id } = c.req.valid("param");

        // Find the id in the details
        const detail = details.getOne(id);
        if (detail.type !== DetailType.Class) throw new HTTPException(400, { message: "Unsupported schedule type" });
        if (detail.name === null) throw new HTTPException(500, { message: "Invalid class" });

        // Fetch the schedule from the schedule loader and parse it
        const parsed = await fetchBakalari(week, detail).then(({ html }) => bakalariParser.parse(detail, html));

        // Fetch substitutions from SSSVT
        await Promise.all(
            parsed.map(async (day) => {
                const sssvt = await fetchSSSVT(day.date as Date).then((html) => sssvtParser.parse(html));

                // Try to find the class in the SSSVT schedule
                const sssvtClass = sssvt.classes[detail.name!];

                // Merge the schedules (if the class was found)
                if (sssvtClass) day.merge(sssvtClass);
            })
        );

        // Return the schedule (cast as any because toJSON will be called by JSON.stringify)
        return c.jsonT<ScheduleJSON[]>(parsed as any);
    });

export default MergedEndpoints;
