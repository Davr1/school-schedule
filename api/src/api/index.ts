import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { etag } from "hono/etag";
import { HTTPException } from "hono/http-exception";
import { prettyJSON } from "hono/pretty-json";

import BakalariEndpoints from "@/api/bakalari";
import DetailsEndpoints from "@/api/details";
import MergedEndpoints from "@/api/merge";
import { minifyJSON } from "@/api/minify";
import SSSVTEndpoints from "@/api/sssvt";

import { version } from "../../package.json";

const api = new OpenAPIHono()
    // Register the openapi endpoint
    .doc("/openapi", {
        openapi: "3.0.3",
        info: { version, title: "Schedule api" },
        servers: [{ url: "/api" }]
    })

    // Allow CORS from all origins, add the etag header and allow ?pretty and ?minify query parameters
    .use("*", cors(), etag(), minifyJSON, prettyJSON())

    // Base endpoint, returns version
    .get("/", (c) => c.json({ version }))

    // Details endpoints
    .route("/details", DetailsEndpoints)

    // Bakalari endpoint
    .route("/bakalari", BakalariEndpoints)

    // SSSVT endpoint
    .route("/sssvt", SSSVTEndpoints)

    // Merged endpoint
    .route("/merged", MergedEndpoints)

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
        } else if (err instanceof TypeError) {
            // If the error is a TypeError, send a 400 error
            return c.json({ error: err.message }, 400);
        }

        // Log all other errors and send a 500 response
        console.error(err);
        return c.json({ error: "Internal server error" }, 500);
    });

export default api;
export type App = typeof api;
