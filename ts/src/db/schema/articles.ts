import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const articlesTable = sqliteTable(
    "articles",
    {
        id: text("id").primaryKey().unique(),
        articleMetadata: text("article_metadata").notNull(),
        createdAt: integer("created_at", { mode: "timestamp" })
            .default(sql`(unixepoch('now'))`)
            .notNull(),
        updatedAt: integer("updated_at", { mode: "timestamp" })
            .default(sql`(unixepoch('now'))`)
            .notNull(),
    },
    (table) => {
        return [index("idx_article_id").on(table.id)];
    },
);

export const articlesSelectSchema = createSelectSchema(articlesTable);
export const articlesSelectSchemaArray = z.array(articlesSelectSchema);
export const articlesInsertSchema = createInsertSchema(articlesTable);

export type ArticlesInsert = z.infer<typeof articlesInsertSchema>;
