import { z } from "@hono/zod-openapi";

import { BakalariAbsenceType, BakalariLessonType } from "@/classes/bakalari/lesson";
import { Week } from "@/loader/bakalari";
import { detailIdSchema } from "@/schemas/details";
import { groupJSONSchema } from "@/schemas/group";

// Typescript types
export type NormalBakalariLessonJSON = z.infer<typeof normalBakalariLessonJSONSchema>;
export type RemovedBakalariLessonJSON = z.infer<typeof removedBakalariLessonJSONSchema>;
export type AbsenceBakalariLessonJSON = z.infer<typeof absenceBakalariLessonJSONSchema>;
export type AnyBakalariLessonJSON = NormalBakalariLessonJSON | RemovedBakalariLessonJSON | AbsenceBakalariLessonJSON;

// Zod schemas
export const weekSchema = z.nativeEnum(Week).openapi("Week", {
    title: "Week",
    description: "The week to get the schedule for. Can be either Permanent, Actual or Next"
});

export const normalBakalariLessonJSONSchema = z
    .object({
        type: z.literal(BakalariLessonType.Normal),
        subject: detailIdSchema.nullish(),
        teacher: detailIdSchema.nullish(),
        room: detailIdSchema.nullish(),
        groups: z.array(groupJSONSchema),
        topic: z.string().nullish(),
        absence: z.nativeEnum(BakalariAbsenceType).nullish().openapi({ description: "Unavailable in the api!" }),
        homework: z.array(z.string()).nullish().openapi({ description: "Unavailable in the api!" }),
        change: z.string().nullish()
    })

    .openapi("NormalBakalariLesson", {
        title: "NormalBakalariLesson",
        description: "A normal bakalari lesson",
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

export const removedBakalariLessonJSONSchema = z
    .object({
        type: z.literal(BakalariLessonType.Removed),
        change: z.string()
    })

    .openapi("RemovedBakalariLesson", {
        title: "RemovedBakalariLesson",
        description: "A bakalari removed lesson",
        example: {
            type: BakalariLessonType.Removed,
            change: "Canceled (...)"
        }
    });

export const absenceBakalariLessonJSONSchema = z
    .object({
        type: z.literal(BakalariLessonType.Absence),
        info: z.string(),
        name: z.string().nullish(),
        change: z.string().nullish()
    })

    .openapi("AbsenceBakalariLesson", {
        title: "AbsenceBakalariLesson",
        description: "Bakalari lesson absence",
        example: {
            type: BakalariLessonType.Absence,
            info: "Absc",
            name: "Obecná absence ...",
            change: null
        }
    });

export const anyBakalariLessonJSONSchema = z
    .union([normalBakalariLessonJSONSchema, removedBakalariLessonJSONSchema, absenceBakalariLessonJSONSchema])
    .openapi({ title: "AnyBakalariLesson" });
