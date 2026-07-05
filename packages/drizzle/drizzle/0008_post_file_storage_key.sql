ALTER TABLE "post_file" ADD COLUMN "storage_key" text;--> statement-breakpoint
UPDATE "post_file"
SET "storage_key" = "id"::text || CASE "mime_type"::text
  WHEN 'image/avif' THEN '.avif'
  WHEN 'image/gif' THEN '.gif'
  WHEN 'image/heic' THEN '.heic'
  WHEN 'image/heif' THEN '.heif'
  WHEN 'image/jpeg' THEN '.jpg'
  WHEN 'image/png' THEN '.png'
  WHEN 'image/svg+xml' THEN '.svg'
  WHEN 'image/webp' THEN '.webp'
END
WHERE "mime_type" IS NOT NULL;--> statement-breakpoint
ALTER TABLE "post_file" ADD CONSTRAINT "post_file_storage_key_unique" UNIQUE("storage_key");
