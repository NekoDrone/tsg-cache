import { createClient } from "@libsql/client/web";
import { drizzle } from "drizzle-orm/libsql";
import { schema } from "@/db/schema";

const turso = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

const db = drizzle(turso, { schema });

export default db;
