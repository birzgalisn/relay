import { posts } from '../../../schema';
import type { PackageSeed } from '../types';
import { POSTS } from './data';

export const postsSeed = {
  name: 'posts',
  run: async (tx) => {
    if (await tx.query.posts.findFirst({ columns: { id: true } })) {
      return;
    }

    for (const post of POSTS) {
      await tx.insert(posts).values(post);
    }
  },
} as const satisfies PackageSeed;
