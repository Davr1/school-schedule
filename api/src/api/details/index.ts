import { OpenAPIHono } from "@hono/zod-openapi";

import detailByAbbreviationRoute from "@/api/details/abbreviation";
import allDetailsRoute from "@/api/details/all";
import detailByIdRoute from "@/api/details/id";
import detailsByTypeRoute from "@/api/details/type";
import { DetailHandler } from "@/classes";
import type { DetailJSON } from "@/schemas";

const DetailsEndpoints = new OpenAPIHono()
    // Get all details
    .openapi(allDetailsRoute, async (c) => {
        return c.json<DetailJSON[]>(DetailHandler.instance.details as DetailJSON[]);
    })

    // Get all details of a specific type
    .openapi(detailsByTypeRoute, async (c) => {
        const detailsOfType = DetailHandler.instance.getOfType(c.req.valid("param").type);

        // Return the details
        return c.json<DetailJSON[]>(detailsOfType as DetailJSON[]);
    })

    // Get a specific detail by id
    .openapi(detailByIdRoute, async (c) => {
        const detail = DetailHandler.instance.getOne(c.req.param("id"));

        // Return the detail
        return c.json<DetailJSON>(detail as DetailJSON);
    })

    // Get a specific detail by its abbreviation
    .openapi(detailByAbbreviationRoute, async (c) => {
        const detail = DetailHandler.instance.getOneByAbbreviation(c.req.param("abbr"));

        // Return the detail
        return c.json<DetailJSON>(detail as DetailJSON);
    });

export default DetailsEndpoints;
