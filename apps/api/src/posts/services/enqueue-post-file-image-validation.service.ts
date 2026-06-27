import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

import { POST_FILE_IMAGE_VALIDATION_QUEUE } from '../../infrastructure/queue/tokens/queue.tokens';
import {
  VALIDATE_POST_FILE_IMAGE_JOB_NAME,
  type ValidatePostFileImageJob,
} from '../jobs/validate-post-file-image.job';

@Injectable()
export class EnqueuePostFileImageValidationService {
  constructor(
    @InjectQueue(POST_FILE_IMAGE_VALIDATION_QUEUE)
    private readonly validationQueue: Queue<ValidatePostFileImageJob>,
  ) {}

  async enqueue(payload: ValidatePostFileImageJob): Promise<void> {
    await this.validationQueue.add(VALIDATE_POST_FILE_IMAGE_JOB_NAME, payload, {
      removeOnComplete: true,
      removeOnFail: 100,
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
    });
  }
}
