import { z } from "@hono/zod-openapi";

import { DetailType } from "@/classes/details/details";
import { classes, rooms, teachers } from "@/classes/details/static";

// Typescript types
export type DetailJSON = z.infer<typeof detailJSONSchema>;
export type ClassDetailJSON = z.infer<typeof classDetailJSONSchema>;
export type TeacherDetailJSON = z.infer<typeof teacherDetailJSONSchema>;
export type AnyDetailJSON = DetailJSON | ClassDetailJSON | TeacherDetailJSON;

// Zod schemas
export const detailTypeSchema = z.nativeEnum(DetailType).openapi("DetailType", {
    title: "DetailType",
    description: "The type of the detail"
});

export const detailIdSchema = z.string().openapi({
    description: "The id of the detail",
    example: "UE"
});

export const detailJSONSchema = z
    .object({
        type: z.enum([DetailType.Room, DetailType.Subject]),
        id: detailIdSchema,
        name: z.string().nullish()
    })

    .openapi("Detail", {
        title: "Detail",
        example: rooms[104] as any,
        description:
            "Detail represents any class, subject or room. For teachers, TeacherDetail is used instead. Subjects (unlike the rest, which use Bakalari ids) use their abbreviation as their id."
    });

export const classDetailJSONSchema = z
    .object({
        type: z.literal(DetailType.Class),
        id: detailIdSchema,
        name: z.string().openapi({ description: "The name of the class" }),
        teacher: z.string().nullish(),
        room: z.string().nullish()
    })

    .openapi("ClassDetail", {
        title: "ClassDetail",
        example: { ...classes["P3.B"], teacher: teachers.masek.id, room: rooms[104].id },
        description: "ClassDetail represents a class and extends Detail."
    });

export const teacherDetailJSONSchema = z
    .object({
        type: z.literal(DetailType.Teacher),
        id: detailIdSchema,
        abbreviation: z.string(),
        name: z.string().openapi({ description: "The login name of the teacher" }),
        firstName: z.string().nullish(),
        lastName: z.string().nullish(),
        prefix: z.string().nullish(),
        suffix: z.string().nullish()
    })

    .openapi("TeacherDetail", {
        title: "TeacherDetail",
        example: teachers.masek,
        description: "TeacherDetail represents a teacher and extends Detail."
    });

export const anyDetailJSONSchema = z
    .union([detailJSONSchema, classDetailJSONSchema, teacherDetailJSONSchema])
    .openapi({ title: "AnyDetail", description: "Any detail - a class, subject, room or teacher." });
