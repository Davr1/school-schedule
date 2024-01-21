import { z } from "@hono/zod-openapi";

import { detailIdSchema } from "@/schemas/details";
import { anyLessonJSONSchema } from "@/schemas/lesson";
import { dateSchema } from "@/schemas/shared";

// Typescript types
export type ScheduleJSON = z.infer<typeof scheduleJSONSchema>;

// Zod schemas
export const scheduleJSONSchema = z
    .object({
        date: z.union([
            dateSchema,
            z.number().openapi({ description: "The day index of the schedule (0-6). Used only for permanent schedules", example: 1 })
        ]),
        detail: detailIdSchema,
        event: z.string().nullish().openapi({ description: "An event description. When not null, periods will be empty." }),
        periods: z.array(z.array(anyLessonJSONSchema)).openapi({ description: "The periods of the schedule" })
    })

    .openapi("Schedule", {
        title: "Schedule",
        description: "Schedule for a day"
    });
