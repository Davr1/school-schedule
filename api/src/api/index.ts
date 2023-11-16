import { Hono } from "hono";
import { cors } from "hono/cors";

import BakalariEndpoints from "@/api/bakalari";

import { version } from "../../package.json";

const app = new Hono()
    // Allow CORS from all origins
    .use(cors())

    // Base endpoint, returns version
    .get("/", (c) => c.jsonT({ version }))

    // Bakalari endpoint
    .route("/bakalari/", BakalariEndpoints);

export default app;
export type App = typeof app;
