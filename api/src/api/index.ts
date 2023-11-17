import { Hono } from "hono";
import { cors } from "hono/cors";
import { etag } from "hono/etag";

import BakalariEndpoints from "@/api/bakalari";
import context from "@/api/context";
import DetailsEndpoints from "@/api/details";

import { version } from "../../package.json";

const api = new Hono()
    // Allow CORS from all origins and add the etag header
    .use("*", cors(), etag())

    // Base endpoint, returns version
    .get("/", (c) => c.jsonT({ version }))

    // Details endpoints
    .route("/details", DetailsEndpoints(context))

    // Bakalari endpoints
    .route("/bakalari", BakalariEndpoints(context));

export default api;
export type App = typeof api;
