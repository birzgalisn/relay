import { PostStatus } from '../../../schema';

export const POSTS = [
  { caption: 'First post', status: PostStatus.PUBLISHED },
  { caption: 'Second post', status: PostStatus.PUBLISHED },
  { caption: 'Third post', status: PostStatus.PUBLISHED },
] as const;
