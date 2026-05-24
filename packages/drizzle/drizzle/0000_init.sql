CREATE TYPE "public"."post_file_upload_status" AS ENUM('pending', 'ready', 'failed');--> statement-breakpoint
CREATE TABLE "post_file" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"tus_upload_id" text,
	"upload_status" "post_file_upload_status" DEFAULT 'ready' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"mime_type" text,
	"byte_size" integer,
	"created_at" timestamp (3) DEFAULT now() NOT NULL,
	CONSTRAINT "post_file_tus_upload_id_unique" UNIQUE("tus_upload_id")
);
--> statement-breakpoint
CREATE TABLE "post" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"caption" text,
	"created_at" timestamp (3) DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "post_file" ADD CONSTRAINT "post_file_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "post_file_post_id_index" ON "post_file" USING btree ("post_id");--> statement-breakpoint
CREATE UNIQUE INDEX "post_file_post_id_sort_order_unique" ON "post_file" USING btree ("post_id","sort_order");--> statement-breakpoint
CREATE INDEX "post_created_at_index" ON "post" USING btree ("created_at");--> statement-breakpoint
CREATE OR REPLACE FUNCTION relay_set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;--> statement-breakpoint
DROP TRIGGER IF EXISTS post_set_updated_at ON "post";--> statement-breakpoint
CREATE TRIGGER post_set_updated_at
  BEFORE UPDATE ON "post"
  FOR EACH ROW
  EXECUTE PROCEDURE relay_set_updated_at();