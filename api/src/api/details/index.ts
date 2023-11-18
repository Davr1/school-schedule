import { OpenAPIHono } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";

import type { ApiContext } from "@/api/context";
import detailByAbbreviationRoute from "@/api/details/abbreviation";
import allDetailsRoute from "@/api/details/all";
import detailByIdRoute from "@/api/details/id";
import type { DetailJSON } from "@/schemas";

const DetailsEndpoints = ({ details }: ApiContext) =>
    new OpenAPIHono()
        // Get all details
        .openapi(allDetailsRoute, async (c) => {
            return c.jsonT<DetailJSON[]>(details.details as DetailJSON[]);
        })

        // Get a specific detail by id
        .openapi(detailByIdRoute, async (c) => {
            const detail = details.get(c.req.param("id"));
            console.log(detail, c.req.param("id"));

            // Return the detail
            if (detail) return c.jsonT<DetailJSON>(detail as DetailJSON);
            throw new HTTPException(404, { message: "Detail not found" });
        })

        // Get a specific detail by its abbreviation
        .openapi(detailByAbbreviationRoute, async (c) => {
            const detail = details.getByAbbreviation(c.req.param("abbr"));

            // Return the detail
            if (detail) return c.jsonT<DetailJSON>(detail as DetailJSON);
            throw new HTTPException(404, { message: "Detail not found" });
        });

export default DetailsEndpoints;
