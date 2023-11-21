import { createRoute, z } from "@hono/zod-openapi";

import { anyDetailJSONSchema, detailNotFoundErrorSchema } from "@/schemas";

const detailByAbbreviationRoute = createRoute({
    tags: ["Details"],
    description: "Get a detail by its abbreviation",
    method: "get",
    path: "/abbreviation/{abbr}",
    request: {
        params: z.object({
            abbr: z.string().openapi({ example: "Ma" })
        })
    },
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: anyDetailJSONSchema
                }
            },
            description: "Detail with the given abbreviation was found"
        },
        404: {
            content: {
                "application/json": {
                    schema: detailNotFoundErrorSchema
                }
            },
            description: "Detail not found"
        }
    }
});

export default detailByAbbreviationRoute;
