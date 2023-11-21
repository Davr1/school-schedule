import { z } from "@hono/zod-openapi";

export const dateSchema = z
    .string()
    .openapi({ description: "The date of the schedule in ISO format", example: new Date("2023-09-04").toISOString() });
