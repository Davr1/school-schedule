import { createRoute, z } from "@hono/zod-openapi";

import { anyDetailJSONSchema, detailTypeSchema } from "@/schemas";

const detailsByTypeRoute = createRoute({
    tags: ["Details"],
    description: "Get all details of a specific type",
    method: "get",
    path: "/{type}",
    request: {
        params: z.object({
            type: detailTypeSchema
        })
    },
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: z.array(anyDetailJSONSchema).openapi({ title: "Detail array" })
                }
            },
            description: "A list of all details that match the given type"
        }
    }
});

export default detailsByTypeRoute;
