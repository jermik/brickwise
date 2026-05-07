CREATE TYPE "public"."content_platform" AS ENUM('tiktok', 'instagram_reels', 'youtube_shorts', 'linkedin', 'x');--> statement-breakpoint
CREATE TYPE "public"."content_status" AS ENUM('idea', 'scripted', 'recorded', 'edited', 'posted');--> statement-breakpoint
CREATE TABLE "content_ideas" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"platform" "content_platform" NOT NULL,
	"audience" text NOT NULL,
	"niche" text NOT NULL,
	"city" text NOT NULL,
	"angle" text NOT NULL,
	"hook" text NOT NULL,
	"script_scenes" jsonb NOT NULL,
	"voiceover" text,
	"subtitles_srt" text,
	"captions_plain" text,
	"caption" text NOT NULL,
	"hashtags" text NOT NULL,
	"cta" text NOT NULL,
	"thumbnail_text" text,
	"pinned_comment" text,
	"duration_seconds" integer NOT NULL,
	"retention_notes" text,
	"status" "content_status" DEFAULT 'idea' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "content_ideas_status_idx" ON "content_ideas" USING btree ("status");--> statement-breakpoint
CREATE INDEX "content_ideas_platform_idx" ON "content_ideas" USING btree ("platform");