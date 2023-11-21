import { createRoute, z } from "@hono/zod-openapi";

import { anyDetailJSONSchema, detailIdSchema, detailNotFoundErrorSchema } from "@/schemas";

const detailByIdRoute = createRoute({
    tags: ["Details"],
    description: "Get a detail by its id",
    method: "get",
    path: "/id/{id}",
    request: {
        params: z.object({
            id: detailIdSchema
        })
    },
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: anyDetailJSONSchema
                }
            },
            description: "Detail with the given id was found"
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

export default detailByIdRoute;
