-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "feeds" (
	"url" text PRIMARY KEY NOT NULL,
	"title" text,
	"description" text,
	"language" text,
	"link" text,
	"published" timestamp with time zone,
	"added" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"feed_url" text NOT NULL,
	"title" text,
	"description" text,
	"image" text,
	"added" timestamp with time zone,
	"upvote_count" integer DEFAULT 0,
	CONSTRAINT "items_url_feed_url_key" UNIQUE("url","feed_url")
);

*/