// Re-export client and db
export { default as client, db } from "@/database/mongo/client";

// Re-export collections
export { default as cache } from "@/database/mongo/cache";
export { default as events } from "@/database/mongo/event";
