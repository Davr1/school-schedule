import { z } from "@hono/zod-openapi";

import { DetailType } from "@/classes";
import { rooms, teachers } from "@/static";

// Typescript types
export type DetailJSON = z.infer<typeof detailJSONSchema>;
export type TeacherDetailJSON = z.infer<typeof teacherDetailJSONSchema>;
export type AnyDetailJSON = DetailJSON | TeacherDetailJSON;

// Zod schemas
export const detailIdSchema = z.string().openapi({
    description: "The id of the detail",
    example: "UE"
});

export const detailJSONSchema = z
    .object({
        type: z.enum([DetailType.Class, DetailType.Room, DetailType.Subject]),
        id: detailIdSchema,
        name: z.string().nullish()
    })

    .openapi("Detail", {
        title: "Detail",
        example: rooms[0] as any,
        description:
            "Detail represents any class, subject or room. For teachers, TeacherDetail is used instead. Subjects (unlike the rest, which use Bakalari ids) use their abbreviation as their id."
    });

export const teacherDetailJSONSchema = z
    .object({
        type: z.literal(DetailType.Teacher),
        id: detailIdSchema,
        name: z.string().nullish(),
        abbreviation: z.string()
    })

    .openapi("TeacherDetail", {
        title: "TeacherDetail",
        example: teachers[0],
        description: "TeacherDetail represents a teacher and extends Detail."
    });

export const anyDetailJSONSchema = z
    .union([detailJSONSchema, teacherDetailJSONSchema])
    .openapi({ title: "AnyDetail", description: "Any detail - a class, subject, room or teacher." });
