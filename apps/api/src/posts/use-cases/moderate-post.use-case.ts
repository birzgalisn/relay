import { Injectable, Logger } from '@nestjs/common';
import { DrizzleService, posts, PostStatus } from '@repo/drizzle';
import { and, eq, inArray } from 'drizzle-orm';

import type { UseCase } from '../../shared/interfaces/use-case.interface';
import { PostEventsService } from '../services/post-events.service';

@Injectable()
export class ModeratePostUseCase implements UseCase<string, void> {
  private readonly logger = new Logger(ModeratePostUseCase.name);

  constructor(
    private readonly drizzle: DrizzleService,
    private readonly postEvents: PostEventsService,
  ) {}

  async execute(postId: string): Promise<void> {
    const previousStatus = await this.drizzle.db.transaction(async (tx) => {
      const post = await tx.query.posts.findFirst({
        where: and(
          eq(posts.id, postId),
          inArray(posts.status, [PostStatus.PUBLISHING, PostStatus.PUBLISHED]),
        ),
        columns: { id: true, status: true },
      });

      if (!post) {
        return null;
      }

      await tx.update(posts).set({ status: PostStatus.MODERATED }).where(eq(posts.id, postId));

      return post.status;
    });

    if (!previousStatus) {
      return;
    }

    this.logger.log(`Post moderated: ${postId}`);

    if (previousStatus === PostStatus.PUBLISHED) {
      await this.postEvents.broadcastRemoved(postId);
    }
  }
}
