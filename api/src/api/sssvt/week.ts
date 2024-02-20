import { createRoute, z } from "@hono/zod-openapi";

import { Week } from "@/request";
import { additionalDetailsSchema, detailsParamDescription, detailsParamSchema, sssvtJSONSchema } from "@/schemas";

export type SSSVTWeekSubstitutionResponse = z.infer<typeof sssvtWeekSubstitutionResponseSchema>;

const sssvtWeekSubstitutionResponseSchema = z.object({
    schedules: z.array(sssvtJSONSchema),
    additionalDetails: additionalDetailsSchema
});

const sssvtWeekSubstitutionRoute = createRoute({
    tags: ["SSSVT"],
    description: `Get a SSSVT substitution schedule for the whole week.\n\n${detailsParamDescription}`,
    method: "get",
    path: "/week/{week}",
    request: {
        params: z.object({
            week: z.enum([Week.Current, Week.Next]).openapi({ description: "The week to get the substitution schedules for" })
        }),
        query: z.object({
            details: detailsParamSchema
        })
    },
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: sssvtWeekSubstitutionResponseSchema
                }
            },
            description: "SSSVT substitution schedules for the whole week"
        }
    }
});

export default sssvtWeekSubstitutionRoute;
