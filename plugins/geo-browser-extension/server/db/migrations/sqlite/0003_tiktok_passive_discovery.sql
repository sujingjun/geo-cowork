CREATE TABLE `creator_profiles` (
	`identity_key` text PRIMARY KEY NOT NULL,
	`platform` text NOT NULL,
	`stable_id` text,
	`username` text,
	`nickname` text,
	`avatar_url` text,
	`signature` text,
	`country` text,
	`language` text,
	`gender` text,
	`skin_tone` text,
	`age_range` text,
	`follower_count` integer,
	`following_count` integer,
	`video_count` integer,
	`total_favorited` integer,
	`field_sources` text DEFAULT '{}' NOT NULL,
	`first_seen_at` text NOT NULL,
	`last_seen_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `creator_profiles_platform_stable_id_idx` ON `creator_profiles` (`platform`,`stable_id`);
--> statement-breakpoint
CREATE INDEX `creator_profiles_platform_username_idx` ON `creator_profiles` (`platform`,`username`);
--> statement-breakpoint
CREATE TABLE `creator_videos` (
	`video_key` text PRIMARY KEY NOT NULL,
	`platform` text NOT NULL,
	`video_id` text NOT NULL,
	`creator_identity` text,
	`creator_username` text,
	`url` text,
	`description` text,
	`like_count` integer,
	`play_count` integer,
	`favorite_count` integer,
	`comment_count` integer,
	`share_count` integer,
	`engagement_rate` real,
	`field_sources` text DEFAULT '{}' NOT NULL,
	`first_seen_at` text NOT NULL,
	`last_seen_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `creator_discovery_sources` (
	`source_key` text PRIMARY KEY NOT NULL,
	`platform` text NOT NULL,
	`creator_identity` text NOT NULL,
	`page_url` text NOT NULL,
	`source` text NOT NULL,
	`observed_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `creator_discovery_sources_creator_idx` ON `creator_discovery_sources` (`creator_identity`,`observed_at`);
--> statement-breakpoint
CREATE TABLE `comment_analyses` (
	`comment_key` text PRIMARY KEY NOT NULL,
	`platform` text NOT NULL,
	`comment_id` text NOT NULL,
	`video_id` text,
	`creator_identity` text,
	`sentiment` text NOT NULL,
	`sentiment_confidence` real NOT NULL,
	`keywords` text DEFAULT '[]' NOT NULL,
	`analyzed_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `creator_comment_insights` (
	`creator_identity` text PRIMARY KEY NOT NULL,
	`positive_count` integer DEFAULT 0 NOT NULL,
	`neutral_count` integer DEFAULT 0 NOT NULL,
	`negative_count` integer DEFAULT 0 NOT NULL,
	`keywords` text DEFAULT '[]' NOT NULL,
	`analyzed_comment_count` integer DEFAULT 0 NOT NULL,
	`updated_at` text NOT NULL
);
