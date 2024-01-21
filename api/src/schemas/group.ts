import { z } from "@hono/zod-openapi";

import { detailIdSchema } from "@/schemas/details";

// Typescript types
export type GroupJSON = z.infer<typeof groupJSONSchema>;

// Zod schemas
export const groupJSONSchema = z
    .object({
        number: z.number().nullish(),
        class: detailIdSchema.nullish()
    })

    .openapi("Group", {
        title: "Group",
        description: "Class group",
        example: {
            class: "UE",
            number: 1
        }
    });
