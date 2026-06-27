import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import { POST_FILE_IMAGE_VALIDATION_QUEUE } from '../../infrastructure/queue/queue.tokens';
import {
  validatePostFileImageJobSchema,
  type ValidatePostFileImageJob,
} from '../jobs/validate-post-file-image.job';
import { MarkPostFileReadyUseCase } from '../use-cases/mark-post-file-ready.use-case';
import { MarkPostFileRejectedUseCase } from '../use-cases/mark-post-file-rejected.use-case';
import { ResolvePostStatusUseCase } from '../use-cases/resolve-post-status.use-case';
import { ValidatePostFileImageUseCase } from '../use-cases/validate-post-file-image.use-case';

@Processor(POST_FILE_IMAGE_VALIDATION_QUEUE, { concurrency: 1 })
export class ValidatePostFileImageProcessor extends WorkerHost {
  private readonly logger = new Logger(ValidatePostFileImageProcessor.name);

  constructor(
    private readonly validatePostFileImage: ValidatePostFileImageUseCase,
    private readonly markPostFileReady: MarkPostFileReadyUseCase,
    private readonly markPostFileRejected: MarkPostFileRejectedUseCase,
    private readonly resolvePostStatus: ResolvePostStatusUseCase,
  ) {
    super();
  }

  async process(job: Job<ValidatePostFileImageJob>): Promise<void> {
    const parsed = validatePostFileImageJobSchema.safeParse(job.data);

    if (!parsed.success) {
      this.logger.warn(`Invalid job ${job.id}: ${parsed.error.message}`);
      return;
    }

    const result = await this.validatePostFileImage.execute(parsed.data);

    if (!result) {
      return;
    }

    const { postId, postFileId, safe, reason } = result;

    if (safe) {
      await this.markPostFileReady.execute(postFileId);
    } else {
      await this.markPostFileRejected.execute({ postFileId, reason });
    }

    await this.resolvePostStatus.execute(postId);
  }
}
