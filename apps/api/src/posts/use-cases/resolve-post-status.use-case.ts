import { Injectable } from '@nestjs/common';
import { DrizzleService, posts, PostStatus } from '@repo/drizzle';
import { and, eq, inArray } from 'drizzle-orm';

import type { UseCase } from '../../infrastructure/shared/interfaces/use-case.interface';
import type { PostModel } from '../models/post.model';
import { PostsFeedPubSubService } from '../posts-feed-pubsub.service';
import {
  allPostFilesReady,
  hasFailedPostFiles,
  hasPendingPostFiles,
  hasProcessingPostFiles,
} from '../util/post-file-upload-state.util';

@Injectable()
export class ResolvePostStatusUseCase implements UseCase<string, void> {
  constructor(
    private readonly drizzle: DrizzleService,
    private readonly postsFeedPubSub: PostsFeedPubSubService,
  ) {}

  async execute(postId: string): Promise<void> {
    const publishedPost = await this.drizzle.db.transaction(async (tx) => {
      const post = await tx.query.posts.findFirst({
        where: and(
          eq(posts.id, postId),
          inArray(posts.status, [PostStatus.PUBLISHING, PostStatus.MODERATED]),
        ),
        with: {
          files: {
            orderBy: (t, { asc }) => [asc(t.sortOrder)],
          },
        },
      });

      if (!post) {
        return null;
      }

      if (hasPendingPostFiles(post.files) || hasProcessingPostFiles(post.files)) {
        return null;
      }

      if (hasFailedPostFiles(post.files)) {
        await tx.update(posts).set({ status: PostStatus.MODERATED }).where(eq(posts.id, postId));
        return null;
      }

      if (!allPostFilesReady(post.files)) {
        return null;
      }

      await tx.update(posts).set({ status: PostStatus.PUBLISHED }).where(eq(posts.id, postId));

      return post satisfies PostModel;
    });

    if (publishedPost) {
      await this.postsFeedPubSub.publishCreated(publishedPost);
    }
  }
}
