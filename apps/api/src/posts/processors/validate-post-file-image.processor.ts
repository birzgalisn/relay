import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import { POST_FILE_IMAGE_VALIDATION_QUEUE } from '../../infrastructure/queue/queue.tokens';
import {
  validatePostFileImageJobSchema,
  type ValidatePostFileImageJob,
} from '../jobs/validate-post-file-image.job';
import { ValidatePostFileImageUseCase } from '../use-cases/validate-post-file-image.use-case';

@Processor(POST_FILE_IMAGE_VALIDATION_QUEUE)
export class ValidatePostFileImageProcessor extends WorkerHost {
  private readonly logger = new Logger(ValidatePostFileImageProcessor.name);

  constructor(private readonly validatePostFileImage: ValidatePostFileImageUseCase) {
    super();
  }

  async process(job: Job<ValidatePostFileImageJob>): Promise<void> {
    const parsed = validatePostFileImageJobSchema.safeParse(job.data);

    if (!parsed.success) {
      this.logger.warn(`Invalid job ${job.id}: ${parsed.error.message}`);
      return;
    }

    await this.validatePostFileImage.execute(parsed.data);
  }
}
