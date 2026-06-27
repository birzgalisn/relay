CREATE TYPE "public"."post_status" AS ENUM('publishing', 'published');--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "status" "post_status" DEFAULT 'published' NOT NULL;--> statement-breakpoint
UPDATE "post" SET "status" = 'published';--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "status" SET DEFAULT 'publishing';
