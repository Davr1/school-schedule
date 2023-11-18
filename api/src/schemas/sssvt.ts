import { z } from "@hono/zod-openapi";

import { LessonChangeType } from "@/classes";
import { detailIdSchema } from "@/schemas/details";
import { dateSchema } from "@/schemas/shared";

// Typescript types
export type LessonChangeJSON = z.infer<typeof anyLessonChangeJSONSchema>;
export type LessonSubstitutionJSON = z.infer<typeof lessonSubstitutionJSONSchema>;
export type LessonCancellationJSON = z.infer<typeof lessonCancellationJSONSchema>;
export type AnyLessonChangeJSON = LessonSubstitutionJSON | LessonCancellationJSON;

export type SSSVTJSON = z.infer<typeof sssvtJSONSchema>;

// Zod schemas
export const lesssonChangeJSONSchema = z.object({
    group: z.number().nullish().openapi({
        description: "The group number of the changed lesson, null if the whole class is affected"
    })
});

export const lessonSubstitutionJSONSchema = lesssonChangeJSONSchema
    .extend({
        type: z.literal(LessonChangeType.Substitution),
        subject: detailIdSchema.nullish(),
        teacher: detailIdSchema.nullish(),
        room: detailIdSchema
    })

    .openapi("LessonSubstitution", {
        title: "LessonSubstitution",
        description: "A lesson substitution",
        example: { group: 1, type: LessonChangeType.Substitution, subject: "ANJ", teacher: "UYGLD", room: "OG" }
    });

export const lessonCancellationJSONSchema = lesssonChangeJSONSchema
    .extend({
        type: z.literal(LessonChangeType.Cancellation)
    })

    .openapi("LessonCancellation", {
        title: "LessonCancellation",
        description: "A lesson cancellation",
        example: { group: null, type: LessonChangeType.Cancellation }
    });

export const anyLessonChangeJSONSchema = z.union([lessonSubstitutionJSONSchema, lessonCancellationJSONSchema]);

export const sssvtJSONSchema = z
    .object({
        date: dateSchema,
        classes: z.record(z.string(), z.array(z.array(anyLessonChangeJSONSchema)))
    })

    .openapi("SSSVT", {
        title: "SSSVT",
        description: "SSSVT substitution schedule"
    });
