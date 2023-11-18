import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

import type { ApiContext } from "@/api/context";
import type { DetailsJSON } from "@/classes";

const DetailsEndpoints = ({ details }: ApiContext) =>
    new Hono()
        // Get all details
        .get("/", async (c) => {
            return c.jsonT<DetailsJSON[]>(details.details);
        })

        // Get a specific detail by id
        .get("/:id", async (c) => {
            const detail = details.getDetail(c.req.param("id"));

            // Return the detail
            if (detail) return c.jsonT<DetailsJSON>(detail);
            throw new HTTPException(404, { message: "Detail not found" });
        })

        // Get a specific detail by its abbreviation
        .get("/abbreviation/:abbr", async (c) => {
            const detail = details.getDetailByAbbreviation(c.req.param("abbr"));

            // Return the detail
            if (detail) return c.jsonT<DetailsJSON>(detail);
            throw new HTTPException(404, { message: "Detail not found" });
        });

export default DetailsEndpoints;
