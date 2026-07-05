ALTER TABLE "post_file" DROP CONSTRAINT "post_file_tus_upload_id_unique";--> statement-breakpoint
ALTER TABLE "post_file" DROP COLUMN "tus_upload_id";
