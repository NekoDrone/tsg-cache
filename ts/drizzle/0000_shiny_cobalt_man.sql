CREATE TABLE `articles` (
	`id` text PRIMARY KEY NOT NULL,
	`article_metadata` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch('now')) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `articles_id_unique` ON `articles` (`id`);--> statement-breakpoint
CREATE INDEX `idx_article_id` ON `articles` (`id`);--> statement-breakpoint
CREATE TABLE `nav_items` (
	`label` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`group` text NOT NULL,
	`subgroup` text,
	`order` integer,
	`created_at` integer DEFAULT (unixepoch('now')) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch('now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_nav_items_id` ON `nav_items` (`label`);