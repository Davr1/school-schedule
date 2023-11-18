import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { etag } from "hono/etag";
import { HTTPException } from "hono/http-exception";

import BakalariEndpoints from "@/api/bakalari";
import context from "@/api/context";
import DetailsEndpoints from "@/api/details";

import { version } from "../../package.json";

const api = new OpenAPIHono()
    // Register the openapi endpoint
    .doc("/openapi", {
        openapi: "3.1.0",
        info: { version, title: "Schedule api" },
        servers: [{ url: "/api" }]
    })

    // Allow CORS from all origins and add the etag header
    .use("*", cors(), etag())

    // Base endpoint, returns version
    .get("/", (c) => c.jsonT({ version }))

    // Details endpoints
    .route("/details", DetailsEndpoints(context))

    // Bakalari endpoints
    .route("/bakalari", BakalariEndpoints(context))

    // 404 handler
    .use("*", async (c) => c.json({ error: "Not found" }, 404))

    // Handle errors
    .onError((err, c) => {
        // Check if the error is an HTTPException
        if (err instanceof HTTPException) {
            // If a response is set, send it
            if (err.res) return c.res;

            // Otherwise, send the error message as json
            return c.json({ error: err.message }, err.status);
        }

        // If the error is not an HTTPException, send a 500 error
        return c.json({ error: "Internal server error" }, 500);
    });

export default api;
export type App = typeof api;
