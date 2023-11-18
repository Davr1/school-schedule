import { createRoute, z } from "@hono/zod-openapi";

import { detailIdSchema, errorSchema, scheduleJSONSchema, weekSchema } from "@/schemas";

const bakalariScheduleRoute = createRoute({
    tags: ["Bakalari"],
    description: 'Get a schedule for a Class, Teacher or Room detail. Note that each lesson\'s "sssvt" property will always be null.',
    method: "get",
    path: "/{week}/{id}",
    request: {
        params: z.object({
            week: weekSchema,
            id: detailIdSchema
        })
    },
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: z.array(scheduleJSONSchema)
                }
            },
            description: "Schedule for the given detail"
        },
        400: {
            content: {
                "application/json": {
                    schema: errorSchema.openapi({ example: { error: "Unsupported detail type: ..." } })
                }
            },
            description: "Invalid week or detail type"
        },
        404: {
            content: {
                "application/json": {
                    schema: errorSchema.extend({ error: z.literal("Detail not found") })
                }
            },
            description: "Detail not found"
        }
    }
});

export default bakalariScheduleRoute;
