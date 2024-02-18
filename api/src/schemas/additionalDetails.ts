// Typescript types
import { z } from "@hono/zod-openapi";

import { anyDetailJSONSchema } from "@/schemas/details";

export enum DetailsParam {
    /** Include only non-static details that appear in the response */
    Required = "required",

    /** Include non-static details and static details that are present */
    Minimal = "minimal",

    /** Include all static and non-static details */
    All = "all"
}

export const detailsParamDescription = `The details parameter can be either "${DetailsParam.Required}", "${DetailsParam.Minimal}" or "${DetailsParam.All}".
- ${DetailsParam.Required}: Include only non-static details that are present in the response. This will make the response smaller, but will require an additional request to /api/details for the static details.
- ${DetailsParam.Minimal}: Include non-static details and static details if they are present, this removes the need for requesting /api/details for the static details, but doesn't include every static detail.
- ${DetailsParam.All}: Include all static details (just like /api/details) and non-static details. Useful for making a cache from the first request, and using "${DetailsParam.Required}" for subsequent requests.`;

// Zod schemas
export const detailsParamSchema = z.nativeEnum(DetailsParam).optional().openapi({
    title: "DetailsParam",
    description: detailsParamDescription
});

export const additionalDetailsSchema = z.array(anyDetailJSONSchema).optional().openapi({
    title: "AdditionalDetails",
    description: "Additional details for the schedule, depending on the ?details query. May be omitted when ?minify is true"
});
