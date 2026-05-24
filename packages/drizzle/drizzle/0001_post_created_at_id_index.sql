DROP INDEX "post_created_at_index";--> statement-breakpoint
CREATE INDEX "post_created_at_id_index" ON "post" USING btree ("created_at","id");