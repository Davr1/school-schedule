import { createRoute, z } from "@hono/zod-openapi";

import { sssvtJSONSchema } from "@/schemas";

const sssvtSubstitutionRoute = createRoute({
    tags: ["SSSVT"],
    description: "Get a SSSVT substitution schedule",
    method: "get",
    path: "/{date}",
    request: {
        params: z.object({
            date: z.string().openapi({ description: "A date string ", example: "2023-09-04" })
        })
    },
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: sssvtJSONSchema
                }
            },
            description: "SSSVT substitution schedule for the given date"
        }
    }
});

export default sssvtSubstitutionRoute;
