import { PostStatus } from '@repo/drizzle';

export function isPostAcceptingUploads(status: PostStatus): boolean {
  return status === PostStatus.PUBLISHING;
}
