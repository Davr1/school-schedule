import { createRoute, z } from "@hono/zod-openapi";

import { additionalDetailsSchema, detailsParamDescription, detailsParamSchema, sssvtJSONSchema } from "@/schemas";

export type SSSVTSubstitutionResponse = z.infer<typeof sssvtSubstitutionResponseSchema>;

const sssvtSubstitutionResponseSchema = sssvtJSONSchema.extend({
    additionalDetails: additionalDetailsSchema
});

const sssvtSubstitutionRoute = createRoute({
    tags: ["SSSVT"],
    description: `Get a SSSVT substitution schedule for a given date.\n\n${detailsParamDescription}`,
    method: "get",
    path: "/{date}",
    request: {
        params: z.object({
            date: z.string().openapi({ description: "A date string", example: "2023-09-04" })
        }),
        query: z.object({
            details: detailsParamSchema
        })
    },
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: sssvtSubstitutionResponseSchema
                }
            },
            description: "SSSVT substitution schedule for the given date"
        }
    }
});

export default sssvtSubstitutionRoute;
