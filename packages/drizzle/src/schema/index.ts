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

export enum PostFileUploadStatus {
  PENDING = 'pending',
  READY = 'ready',
  FAILED = 'failed',
}

export const postFileUploadStatusEnum = pgEnum('post_file_upload_status', [
  PostFileUploadStatus.PENDING,
  PostFileUploadStatus.READY,
  PostFileUploadStatus.FAILED,
]);

export const posts = pgTable(
  'post',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    caption: text('caption'),
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
    tusUploadId: text('tus_upload_id').unique(),
    uploadStatus: postFileUploadStatusEnum('upload_status')
      .notNull()
      .default(PostFileUploadStatus.READY),
    sortOrder: integer('sort_order').notNull().default(0),
    mimeType: text('mime_type'),
    byteSize: integer('byte_size'),
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
