import { createRoute, z } from "@hono/zod-openapi";

import { anyDetailJSONSchema } from "@/schemas";

const allDetailsRoute = createRoute({
    tags: ["Details"],
    description: "Get all details",
    method: "get",
    path: "/",
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: z.array(anyDetailJSONSchema)
                }
            },
            description: "A list of all details"
        }
    }
});

export default allDetailsRoute;
