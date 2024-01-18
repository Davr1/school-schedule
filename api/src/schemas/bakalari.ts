import { z } from "@hono/zod-openapi";

import { BakalariLessonType } from "@/classes";
import { Week } from "@/loader/bakalari";
import { detailIdSchema } from "@/schemas/details";

// Typescript types
export type NormalLessonJSON = z.infer<typeof normalLessonJSONSchema>;
export type RemovedLessonJSON = z.infer<typeof removedLessonJSONSchema>;
export type AbsenceLessonJSON = z.infer<typeof absenceLessonJSONSchema>;
export type AnyBakalariLessonJSON = NormalLessonJSON | RemovedLessonJSON | AbsenceLessonJSON;

// Zod schemas
export const weekSchema = z.nativeEnum(Week).openapi("Week", {
    title: "Week",
    description: "The week to get the schedule for. Can be either Permanent, Actual or Next"
});

export const normalLessonJSONSchema = z
    .object({
        type: z.literal(BakalariLessonType.Normal),
        subject: detailIdSchema.nullish(),
        teacher: detailIdSchema.nullish(),
        room: detailIdSchema,
        groups: z.array(
            z.object({
                number: z.number().nullish(),
                class: detailIdSchema.nullish()
            })
        ),
        topic: z.string().nullish(),
        change: z.string().nullish()
    })

    .openapi("NormalLesson", {
        title: "NormalLesson",
        description: "A normal lesson",
        example: {
            type: BakalariLessonType.Normal,
            subject: "ANJ",
            teacher: "UYGLD",
            room: "OG",
            groups: [{ number: 1, class: "UE" }],
            topic: "Some english topic",
            change: "Added into timetable: ..."
        }
    });

export const removedLessonJSONSchema = z
    .object({
        type: z.literal(BakalariLessonType.Removed),
        change: z.string()
    })

    .openapi("RemovedLesson", {
        title: "RemovedLesson",
        description: "A removed lesson",
        example: {
            type: BakalariLessonType.Removed,
            change: "Canceled (...)"
        }
    });

export const absenceLessonJSONSchema = z
    .object({
        type: z.literal(BakalariLessonType.Absence),
        info: z.string(),
        name: z.string().nullish(),
        change: z.string().nullish()
    })

    .openapi("AbsenceLesson", {
        title: "AbsenceLesson",
        description: "Lesson absence",
        example: {
            type: BakalariLessonType.Absence,
            info: "Absc",
            name: "Obecná absence ...",
            change: null
        }
    });

export const anyBakalariLessonJSONSchema = z
    .union([normalLessonJSONSchema, removedLessonJSONSchema, absenceLessonJSONSchema])
    .openapi({ title: "AnyBakalariLesson" });
