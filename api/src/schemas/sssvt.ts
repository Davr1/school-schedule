import { z } from "@hono/zod-openapi";

import { SSSVTChangeType } from "@/classes";
import { detailIdSchema } from "@/schemas/details";
import { dateSchema } from "@/schemas/shared";

// Typescript types
export type SSSVTSubstitutionJSON = z.infer<typeof sssvtSubstitutionJSONSchema>;
export type SSSVTCancellationJSON = z.infer<typeof sssvtCancellationJSONSchema>;
export type AnySSSVTChangeJSON = SSSVTSubstitutionJSON | SSSVTCancellationJSON;

export type SSSVTJSON = z.infer<typeof sssvtJSONSchema>;

// Zod schemas
export const sssvtChangeJSONSchema = z.object({
    group: z.number().nullish().openapi({
        description: "The group number of the changed lesson, null if the whole class is affected"
    })
});

export const sssvtSubstitutionJSONSchema = sssvtChangeJSONSchema
    .extend({
        type: z.literal(SSSVTChangeType.Substitution),
        subject: detailIdSchema.nullish(),
        teacher: detailIdSchema.nullish(),
        room: detailIdSchema.nullish()
    })

    .openapi("SSSVTSubstitution", {
        title: "SSSVTSubstitution",
        description: "A sssvt lesson substitution",
        example: { group: 1, type: SSSVTChangeType.Substitution, subject: "ANJ", teacher: "UYGLD", room: "OG" }
    });

export const sssvtCancellationJSONSchema = sssvtChangeJSONSchema
    .extend({
        type: z.literal(SSSVTChangeType.Cancellation)
    })

    .openapi("SSSVTCancellation", {
        title: "SSSVTCancellation",
        description: "A sssvt lesson cancellation",
        example: { group: null, type: SSSVTChangeType.Cancellation }
    });

export const anySSSVTChangeJSONSchema = z
    .union([sssvtSubstitutionJSONSchema, sssvtCancellationJSONSchema])
    .openapi({ title: "AnySSSVTChange" });

export const sssvtJSONSchema = z
    .object({
        date: dateSchema,
        classes: z.record(detailIdSchema, z.array(z.array(anySSSVTChangeJSONSchema)))
    })

    .openapi("SSSVT", {
        title: "SSSVT",
        description: "SSSVT substitution schedule. Classes are indexed by their bakalari id!"
    });
