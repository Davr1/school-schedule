/** Api entrypoint */
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { showRoutes } from "hono/dev";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";

import api from "@/api";
import { minifyJSON } from "@/api/minify";
import scheduleAllClasses from "@/scheduler";

const server = new OpenAPIHono({ strict: false })
    // Log all requests
    .use("*", logger())
    .use("*", minifyJSON)
    .use("*", prettyJSON())

    // Add the swagger UI
    .use("/api/docs", swaggerUI({ url: "/api/openapi" }))

    // Add the api endpoints
    .route("/api", api);

// Log the available routes
showRoutes(server);

// Start the schedule
await scheduleAllClasses();

// Export the server as default. Bun will automatically start it when ran directly.
export default server;

// Quit the process if SIGINT or SIGTERM is received
process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));
