import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

import { POST_FILE_THUMBNAIL_QUEUE } from '../../infrastructure/queue/tokens/queue.tokens';
import {
  GENERATE_POST_FILE_THUMBNAILS_JOB_NAME,
  type GeneratePostFileThumbnailsJob,
} from '../jobs/generate-post-file-thumbnails.job';

@Injectable()
export class EnqueuePostFileThumbnailGenerationService {
  constructor(
    @InjectQueue(POST_FILE_THUMBNAIL_QUEUE)
    private readonly thumbnailQueue: Queue<GeneratePostFileThumbnailsJob>,
  ) {}

  async enqueue(payload: GeneratePostFileThumbnailsJob): Promise<void> {
    await this.thumbnailQueue.add(GENERATE_POST_FILE_THUMBNAILS_JOB_NAME, payload, {
      jobId: payload.postFileId,
      removeOnComplete: true,
      removeOnFail: 100,
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
    });
  }
}
