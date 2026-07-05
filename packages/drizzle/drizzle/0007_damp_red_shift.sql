ALTER TABLE "post_file" DROP COLUMN "upload_status";--> statement-breakpoint
DROP TYPE "public"."post_file_upload_status";--> statement-breakpoint
ALTER TABLE "post_file" ADD COLUMN "validated_at" timestamp (3);
