import { z } from "@hono/zod-openapi";

export const errorSchema = z.object({
    error: z.string()
});

export const detailNotFoundErrorSchema = errorSchema
    .extend({
        error: z.literal("Detail not found")
    })
    .openapi({ title: '"Detail not found" Error' });
