import { z } from "@hono/zod-openapi";

export type ErrorResponse = z.infer<typeof errorSchema>;

export const errorSchema = z.object({
    error: z.string()
});

export const detailNotFoundErrorSchema = errorSchema.openapi({
    title: '"Detail not found" Error',
    example: { error: "Detail with for parameter {param} with value {value} was not found" }
});
