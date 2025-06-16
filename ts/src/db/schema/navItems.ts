import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const navItemsTable = sqliteTable(
    "nav_items",
    {
        label: text("label").primaryKey(),
        slug: text("slug").notNull(),
        group: text("group").notNull(),
        subgroup: text("subgroup"),
        order: integer(),
        createdAt: integer("created_at", { mode: "timestamp" })
            .notNull()
            .default(sql`(unixepoch('now'))`),
        updatedAt: integer("updated_at", { mode: "timestamp" })
            .notNull()
            .default(sql`(unixepoch('now'))`),
    },
    (table) => {
        return [index("idx_nav_items_id").on(table.label)];
    },
);

export const navItemsSelectSchema = createSelectSchema(navItemsTable);
export const navItemsSelectSchemaArray = z.array(navItemsSelectSchema);
export const navItemsInsertSchema = createInsertSchema(navItemsTable);

export type NavItemsInsert = z.infer<typeof navItemsSelectSchema>;
export type NavigationItems = z.infer<typeof navItemsSelectSchema>;
