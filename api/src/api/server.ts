import { Hono } from "hono";
import { logger } from "hono/logger";

import api from "@/api";

const server = new Hono({ strict: false })
    // Log all requests
    .use("*", logger())

    // Add the api endpoints
    .route("/api", api);

// Log the available routes
server.showRoutes();

export default server;
