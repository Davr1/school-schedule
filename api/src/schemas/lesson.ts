import { z } from "@hono/zod-openapi";

import {
    absenceBakalariLessonJSONSchema,
    anyBakalariLessonJSONSchema,
    normalBakalariLessonJSONSchema,
    removedBakalariLessonJSONSchema
} from "@/schemas/bakalari";
import { anySSSVTChangeJSONSchema, sssvtCancellationJSONSchema, sssvtSubstitutionJSONSchema } from "@/schemas/sssvt";

// Typescript types
export type ConflictLessonJSON = z.infer<typeof conflictJSONSchema>;
export type NormalLessonJSON = z.infer<typeof normalLessonJSONSchema>;
export type RemovedLessonJSON = z.infer<typeof removedLessonJSONSchema>;
export type AnyLessonJSON = ConflictLessonJSON | NormalLessonJSON | RemovedLessonJSON;

// Zod schemas
export const conflictJSONSchema = z
    .object({
        type: z.literal("conflict"),
        bakalari: anyBakalariLessonJSONSchema.nullish(),
        sssvt: anySSSVTChangeJSONSchema.nullish()
    })

    .openapi("ConflictLesson", {
        title: "ConflictLesson",
        description: "A merged lesson with a conflict"
    });

export const normalLessonJSONSchema = z
    .object({
        type: z.literal("normal"),
        bakalari: normalBakalariLessonJSONSchema.nullish(),
        sssvt: sssvtSubstitutionJSONSchema.nullish()
    })

    .openapi("NormalLesson", {
        title: "NormalLesson",
        description: "A merged normal lesson"
    });

export const removedLessonJSONSchema = z
    .object({
        type: z.literal("removed"),
        bakalari: z.union([removedBakalariLessonJSONSchema, absenceBakalariLessonJSONSchema]).nullish(),
        sssvt: sssvtCancellationJSONSchema.nullish()
    })

    .openapi("RemovedLesson", {
        title: "RemovedLesson",
        description: "A merged removed lesson"
    });

export const anyLessonJSONSchema = z
    .union([conflictJSONSchema, normalLessonJSONSchema, removedLessonJSONSchema])
    .openapi({ title: "AnyLesson", description: "Any lesson - a normal, removed or conflicting lesson." });
