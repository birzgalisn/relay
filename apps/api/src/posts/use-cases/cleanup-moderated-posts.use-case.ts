import { Injectable, Logger } from '@nestjs/common';
import { DrizzleService, posts, PostStatus } from '@repo/drizzle';
import { AppErrorCode, isAppError } from '@repo/shared';
import { eq } from 'drizzle-orm';

import type { UseCase } from '../../shared/interfaces/use-case.interface';
import { DeletePostUseCase } from './delete-post.use-case';

export type CleanupModeratedPostsResult = {
  deleted: number;
};

@Injectable()
export class CleanupModeratedPostsUseCase implements UseCase<void, CleanupModeratedPostsResult> {
  private readonly logger = new Logger(CleanupModeratedPostsUseCase.name);

  constructor(
    private readonly drizzle: DrizzleService,
    private readonly deletePost: DeletePostUseCase,
  ) {}

  async execute(): Promise<CleanupModeratedPostsResult> {
    const rows = await this.drizzle.db
      .select({ id: posts.id })
      .from(posts)
      .where(eq(posts.status, PostStatus.MODERATED));

    let deleted = 0;
    for (const row of rows) {
      try {
        await this.deletePost.execute(row.id);
        deleted++;
      } catch (error) {
        if (isAppError(error) && error.code === AppErrorCode.NOT_FOUND) {
          continue;
        }

        this.logger.error(`Failed to delete moderated post ${row.id}`, error);
        throw error;
      }
    }

    return { deleted };
  }
}
