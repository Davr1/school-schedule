import { OpenAPIHono } from "@hono/zod-openapi";

import type { ApiContext } from "@/api/context";
import detailByAbbreviationRoute from "@/api/details/abbreviation";
import allDetailsRoute from "@/api/details/all";
import detailByIdRoute from "@/api/details/id";
import detailsByTypeRoute from "@/api/details/type";
import type { DetailJSON } from "@/schemas";

const DetailsEndpoints = ({ details }: ApiContext) =>
    new OpenAPIHono()
        // Get all details
        .openapi(allDetailsRoute, async (c) => {
            return c.jsonT<DetailJSON[]>(details.details as DetailJSON[]);
        })

        // Get all details of a specific type
        .openapi(detailsByTypeRoute, async (c) => {
            const detailsOfType = details.getOfType(c.req.valid("param").type);

            // Return the details
            return c.jsonT<DetailJSON[]>(detailsOfType as DetailJSON[]);
        })

        // Get a specific detail by id
        .openapi(detailByIdRoute, async (c) => {
            const detail = details.getOne(c.req.param("id"));

            // Return the detail
            return c.jsonT<DetailJSON>(detail as DetailJSON);
        })

        // Get a specific detail by its abbreviation
        .openapi(detailByAbbreviationRoute, async (c) => {
            const detail = details.getOneByAbbreviation(c.req.param("abbr"));

            // Return the detail
            return c.jsonT<DetailJSON>(detail as DetailJSON);
        });

export default DetailsEndpoints;
