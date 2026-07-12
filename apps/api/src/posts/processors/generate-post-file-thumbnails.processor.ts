import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import { POST_FILE_THUMBNAIL_QUEUE } from '../../infrastructure/queue/tokens/queue.tokens';
import {
  generatePostFileThumbnailsJobSchema,
  type GeneratePostFileThumbnailsJob,
} from '../jobs/generate-post-file-thumbnails.job';
import { GeneratePostFileThumbnailsUseCase } from '../use-cases/generate-post-file-thumbnails.use-case';
import { MarkPostFileValidatedUseCase } from '../use-cases/mark-post-file-validated.use-case';

@Processor(POST_FILE_THUMBNAIL_QUEUE, { concurrency: 2 })
export class GeneratePostFileThumbnailsProcessor extends WorkerHost {
  private readonly logger = new Logger(GeneratePostFileThumbnailsProcessor.name);

  constructor(
    private readonly generatePostFileThumbnails: GeneratePostFileThumbnailsUseCase,
    private readonly markPostFileValidated: MarkPostFileValidatedUseCase,
  ) {
    super();
  }

  async process(job: Job<GeneratePostFileThumbnailsJob>): Promise<void> {
    const { postFileId } = generatePostFileThumbnailsJobSchema.parse(job.data);

    await this.generatePostFileThumbnails.execute(postFileId);
    await this.markPostFileValidated.execute(postFileId);

    this.logger.log(`Generated thumbnails for post file ${postFileId}`);
  }
}
