import { z } from "@hono/zod-openapi";

import { anyBakalariLessonJSONSchema } from "@/schemas/bakalari";
import { detailIdSchema } from "@/schemas/details";
import { dateSchema } from "@/schemas/shared";
import { anyLessonChangeJSONSchema } from "@/schemas/sssvt";

// Typescript types
export type LessonJSON = z.infer<typeof lessonJSONSchema>;
export type ScheduleJSON = z.infer<typeof scheduleJSONSchema>;

// Zod schemas
export const lessonJSONSchema = z
    .object({
        bakalari: anyBakalariLessonJSONSchema.nullish(),
        sssvt: anyLessonChangeJSONSchema.nullish()
    })

    .openapi("Lesson", {
        title: "Lesson",
        description: "A merged lesson"
    });

export const scheduleJSONSchema = z
    .object({
        date: z.union([
            dateSchema,
            z.number().openapi({ description: "The day index of the schedule (0-6). Used only for permanent schedules", example: 1 })
        ]),
        detail: detailIdSchema,
        event: z.string().nullish().openapi({ description: "An event description. When not null, periods will be empty." }),
        periods: z.array(z.array(lessonJSONSchema)).openapi({ description: "The periods of the schedule" })
    })

    .openapi("Schedule", {
        title: "Schedule",
        description: "Schedule for a day"
    });
