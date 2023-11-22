import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";

import api from "@/api";
import scheduleAllClasses from "@/scheduler";

const server = new OpenAPIHono({ strict: false })
    // Log all requests
    .use("*", logger())
    .use("*", prettyJSON())

    // Add the swagger UI
    .use("/api/docs", swaggerUI({ url: "/api/openapi" }))

    // Add the api endpoints
    .route("/api", api);

// Log the available routes
server.showRoutes();

if (import.meta.main) scheduleAllClasses();

export default server;
