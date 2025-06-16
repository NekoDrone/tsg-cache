import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./src/db/schema",
    out: "./drizzle",
    dialect: "turso",
    dbCredentials: {
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN,
    },
});
