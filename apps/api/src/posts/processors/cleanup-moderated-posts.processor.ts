import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { pluralize } from '@repo/shared';
import { Job } from 'bullmq';

import { MODERATED_POST_CLEANUP_QUEUE } from '../../infrastructure/queue/tokens/queue.tokens';
import type { CleanupModeratedPostsJob } from '../jobs/cleanup-moderated-posts.job';
import { CleanupModeratedPostsUseCase } from '../use-cases/cleanup-moderated-posts.use-case';

@Processor(MODERATED_POST_CLEANUP_QUEUE, { concurrency: 1 })
export class CleanupModeratedPostsProcessor extends WorkerHost {
  private readonly logger = new Logger(CleanupModeratedPostsProcessor.name);

  constructor(private readonly cleanupModeratedPosts: CleanupModeratedPostsUseCase) {
    super();
  }

  async process(_job: Job<CleanupModeratedPostsJob>): Promise<void> {
    const { deleted } = await this.cleanupModeratedPosts.execute();

    if (deleted > 0) {
      this.logger.log(`Deleted ${deleted} moderated ${pluralize(deleted, 'post')}`);
    }
  }
}
