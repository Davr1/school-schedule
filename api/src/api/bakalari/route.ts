import { createRoute, z } from "@hono/zod-openapi";

import {
    additionalDetailsSchema,
    detailIdSchema,
    detailNotFoundErrorSchema,
    detailsParamDescription,
    detailsParamSchema,
    errorSchema,
    scheduleJSONSchema,
    weekSchema
} from "@/schemas";

export type BakalariScheduleResponse = z.infer<typeof bakalariScheduleResponseSchema>;

const bakalariScheduleResponseSchema = z.object({
    schedules: z.array(scheduleJSONSchema),
    additionalDetails: additionalDetailsSchema
});

const bakalariScheduleRoute = createRoute({
    tags: ["Bakalari"],
    description: `Get a schedule for a Class, Teacher or Room detail. Note that each lesson\'s "sssvt" property will always be null.\n\n${detailsParamDescription}`,
    method: "get",
    path: "/{week}/{id}",
    request: {
        params: z.object({
            week: weekSchema,
            id: detailIdSchema
        }),
        query: z.object({
            details: detailsParamSchema
        })
    },
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: bakalariScheduleResponseSchema
                }
            },
            description: "Schedule for the given id"
        },
        400: {
            content: {
                "application/json": {
                    schema: errorSchema.openapi({
                        title: '"Invalid parameters" Error',
                        example: { error: "Unsupported schedule type: ..." }
                    })
                }
            },
            description: "Invalid week or schedule type"
        },
        404: {
            content: {
                "application/json": {
                    schema: detailNotFoundErrorSchema
                }
            },
            description: "Detail for id not found"
        }
    }
});

export default bakalariScheduleRoute;
