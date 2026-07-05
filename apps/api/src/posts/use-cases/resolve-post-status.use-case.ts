import { Injectable } from '@nestjs/common';
import { DrizzleService, posts, PostStatus } from '@repo/drizzle';
import { and, eq } from 'drizzle-orm';

import type { UseCase } from '../../shared/interfaces/use-case.interface';
import type { Post } from '../models/post.model';
import { PostEventsService } from '../services/post-events.service';
import { allPostFilesReadyForPublish } from '../util/post-publish-readiness.util';

@Injectable()
export class ResolvePostStatusUseCase implements UseCase<string, void> {
  constructor(
    private readonly drizzle: DrizzleService,
    private readonly postEvents: PostEventsService,
  ) {}

  async execute(postId: string): Promise<void> {
    const publishedPost = await this.drizzle.db.transaction(async (tx) => {
      const post = await tx.query.posts.findFirst({
        where: and(eq(posts.id, postId), eq(posts.status, PostStatus.PUBLISHING)),
        with: {
          files: {
            orderBy: (t, { asc }) => [asc(t.sortOrder)],
          },
        },
      });

      if (!post || !allPostFilesReadyForPublish(post.files)) {
        return null;
      }

      await tx.update(posts).set({ status: PostStatus.PUBLISHED }).where(eq(posts.id, postId));

      return post satisfies Post;
    });

    if (publishedPost) {
      await this.postEvents.broadcastCreated(publishedPost);
    }
  }
}
