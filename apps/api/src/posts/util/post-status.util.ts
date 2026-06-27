import { PostStatus } from '@repo/drizzle';

const UPLOAD_ACCEPTING_STATUSES = new Set<PostStatus>([
  PostStatus.PUBLISHING,
  PostStatus.MODERATED,
]);

export function isPostAcceptingUploads(status: PostStatus): boolean {
  return UPLOAD_ACCEPTING_STATUSES.has(status);
}
