import { createRoute, z } from "@hono/zod-openapi";

import { Week } from "@/request/bakalari";
import {
    additionalDetailsSchema,
    detailIdSchema,
    detailNotFoundErrorSchema,
    detailsParamDescription,
    detailsParamSchema,
    errorSchema,
    scheduleJSONSchema
} from "@/schemas";

export type MergedScheduleResponse = z.infer<typeof mergedScheduleResponseSchema>;

const mergedScheduleResponseSchema = z.object({
    schedules: z.array(scheduleJSONSchema),
    additionalDetails: additionalDetailsSchema
});

const mergedScheduleRoute = createRoute({
    tags: ["Merged"],
    description: `Get a schedule for a class and merge it with a SSSVT substitution schedule.\n\n${detailsParamDescription}`,
    method: "get",
    path: "/{week}/{id}",
    request: {
        params: z.object({
            week: z
                .enum([Week.Current, Week.Next])
                .openapi({ description: "The week to get the schedule for. Permanent schedules are forbidden." }),
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
                    schema: mergedScheduleResponseSchema
                }
            },
            description: "Merged class schedule for the given id"
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
            description: "Invalid week or detail type"
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

export default mergedScheduleRoute;
