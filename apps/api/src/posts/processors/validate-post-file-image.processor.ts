import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import { POST_FILE_IMAGE_VALIDATION_QUEUE } from '../../infrastructure/queue/tokens/queue.tokens';
import {
  validatePostFileImageJobSchema,
  type ValidatePostFileImageJob,
} from '../jobs/validate-post-file-image.job';
import { MarkPostFileValidatedUseCase } from '../use-cases/mark-post-file-validated.use-case';
import { ModeratePostUseCase } from '../use-cases/moderate-post.use-case';
import { ResolvePostStatusUseCase } from '../use-cases/resolve-post-status.use-case';
import { ValidatePostFileImageUseCase } from '../use-cases/validate-post-file-image.use-case';

@Processor(POST_FILE_IMAGE_VALIDATION_QUEUE, { concurrency: 1 })
export class ValidatePostFileImageProcessor extends WorkerHost {
  private readonly logger = new Logger(ValidatePostFileImageProcessor.name);

  constructor(
    private readonly validatePostFileImage: ValidatePostFileImageUseCase,
    private readonly markPostFileValidated: MarkPostFileValidatedUseCase,
    private readonly resolvePostStatus: ResolvePostStatusUseCase,
    private readonly moderatePost: ModeratePostUseCase,
  ) {
    super();
  }

  async process(job: Job<ValidatePostFileImageJob>): Promise<void> {
    const { postFileId } = validatePostFileImageJobSchema.parse(job.data);

    const result = await this.validatePostFileImage.execute(postFileId);

    if (!result) {
      return;
    }

    const { postId, safe, reason } = result;

    if (!safe) {
      this.logger.log(`Post flagged for moderation: ${reason}`);
      await this.moderatePost.execute(postId);
      return;
    }

    await this.markPostFileValidated.execute(postFileId);
    await this.resolvePostStatus.execute(postId);
  }
}
