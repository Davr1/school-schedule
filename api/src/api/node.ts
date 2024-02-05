/** Api entrypoint compatible with Node.js */
import { serve } from "@hono/node-server";

import server from "@/api/server";

serve(server, (info) => console.log(`Listening on http://localhost:${info.port}`));
