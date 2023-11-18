import { z } from "@hono/zod-openapi";

export const errorSchema = z.object({
    error: z.string()
});
