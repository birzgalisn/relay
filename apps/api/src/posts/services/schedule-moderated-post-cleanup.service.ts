import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';

import { MODERATED_POST_CLEANUP_QUEUE } from '../../infrastructure/queue/tokens/queue.tokens';
import { MODERATED_POST_CLEANUP_CRON } from '../constants/moderated-post-cleanup.constants';
import {
  CLEANUP_MODERATED_POSTS_JOB_NAME,
  type CleanupModeratedPostsJob,
} from '../jobs/cleanup-moderated-posts.job';

const MODERATED_POST_CLEANUP_SCHEDULER_ID = 'moderated-post-cleanup' as const;

@Injectable()
export class ScheduleModeratedPostCleanupService implements OnModuleInit {
  private readonly logger = new Logger(ScheduleModeratedPostCleanupService.name);

  constructor(
    @InjectQueue(MODERATED_POST_CLEANUP_QUEUE)
    private readonly cleanupQueue: Queue<CleanupModeratedPostsJob>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.cleanupQueue.upsertJobScheduler(
      MODERATED_POST_CLEANUP_SCHEDULER_ID,
      { pattern: MODERATED_POST_CLEANUP_CRON },
      {
        name: CLEANUP_MODERATED_POSTS_JOB_NAME,
        data: undefined,
        opts: {
          removeOnComplete: true,
          removeOnFail: 10,
        },
      },
    );

    this.logger.log(`Moderated post cleanup scheduled (${MODERATED_POST_CLEANUP_CRON})`);
  }
}
