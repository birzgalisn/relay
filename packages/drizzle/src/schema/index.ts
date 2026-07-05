import { MediaMimeType, SUPPORTED_MEDIA_MIME_TYPE_VALUES } from '@repo/shared';
import { relations } from 'drizzle-orm';
import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

export { MediaMimeType, SUPPORTED_MEDIA_MIME_TYPE_VALUES };

export enum PostStatus {
  PUBLISHING = 'publishing',
  PUBLISHED = 'published',
  MODERATED = 'moderated',
}

export const postStatusEnum = pgEnum('post_status', [
  PostStatus.PUBLISHING,
  PostStatus.PUBLISHED,
  PostStatus.MODERATED,
]);

export const mediaMimeTypeEnum = pgEnum('media_mime_type', SUPPORTED_MEDIA_MIME_TYPE_VALUES);

export const posts = pgTable(
  'post',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    caption: text('caption'),
    status: postStatusEnum('status').notNull().default(PostStatus.PUBLISHING),
    createdAt: timestamp('created_at', { precision: 3, mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { precision: 3, mode: 'date' }).notNull().defaultNow(),
  },
  (t) => [index('post_created_at_id_index').on(t.createdAt, t.id)],
);

export const postFiles = pgTable(
  'post_file',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    postId: uuid('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    sortOrder: integer('sort_order').notNull().default(0),
    mimeType: mediaMimeTypeEnum('mime_type'),
    storageKey: text('storage_key').unique(),
    byteSize: integer('byte_size'),
    validatedAt: timestamp('validated_at', { precision: 3, mode: 'date' }),
    createdAt: timestamp('created_at', { precision: 3, mode: 'date' }).notNull().defaultNow(),
  },
  (t) => [
    index('post_file_post_id_index').on(t.postId),
    uniqueIndex('post_file_post_id_sort_order_unique').on(t.postId, t.sortOrder),
  ],
);

export const postsRelations = relations(posts, ({ many }) => ({
  files: many(postFiles),
}));

export const postFilesRelations = relations(postFiles, ({ one }) => ({
  post: one(posts, { fields: [postFiles.postId], references: [posts.id] }),
}));
