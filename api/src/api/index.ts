import { Hono } from "hono";
import { cors } from "hono/cors";

import { version } from "../../package.json";

const app = new Hono()
    // Allow CORS from all origins
    .use(cors())

    // Base endpoint, returns version
    .get("/", (c) => c.jsonT({ version }));
    
    // Other endpoints to be added here

export default app;
export type App = typeof app;
