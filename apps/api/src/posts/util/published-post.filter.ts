import { posts, PostStatus } from '@repo/drizzle';
import { and, eq, type SQL } from 'drizzle-orm';

export function wherePostIsPublished(): SQL {
  return eq(posts.status, PostStatus.PUBLISHED);
}

export function andWherePostIsPublished(where: SQL | undefined): SQL | undefined {
  const published = wherePostIsPublished();
  return where ? and(where, published) : published;
}

export function isPublishedPost(status: PostStatus): boolean {
  return status === PostStatus.PUBLISHED;
}
