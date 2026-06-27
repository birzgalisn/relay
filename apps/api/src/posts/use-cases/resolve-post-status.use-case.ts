import { Injectable } from '@nestjs/common';
import { DrizzleService, posts, PostStatus } from '@repo/drizzle';
import { and, eq, inArray } from 'drizzle-orm';

import type { UseCase } from '../../shared/interfaces/use-case.interface';
import type { Post } from '../models/post.model';
import { PostEventsPubSubService } from '../services/post-events-pubsub.service';
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
    private readonly postEventsPubSub: PostEventsPubSubService,
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

      return post satisfies Post;
    });

    if (publishedPost) {
      await this.postEventsPubSub.publishCreated(publishedPost);
    }
  }
}
