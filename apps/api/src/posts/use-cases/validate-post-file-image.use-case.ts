import * as nodePath from 'node:path';

import { Inject, Injectable, Logger } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { DrizzleService, PostFileUploadStatus, postFiles } from '@repo/drizzle';
import { eq } from 'drizzle-orm';

import { mediaConfig } from '../../infrastructure/config/media.config';
import { NsfwService } from '../../infrastructure/nsfw/nsfw.service';
import type { UseCase } from '../../infrastructure/shared/interfaces/use-case.interface';
import type { ValidatePostFileImageJob } from '../jobs/validate-post-file-image.job';
import { DeletePostUseCase } from './delete-post.use-case';

@Injectable()
export class ValidatePostFileImageUseCase implements UseCase<ValidatePostFileImageJob, void> {
  private readonly logger = new Logger(ValidatePostFileImageUseCase.name);

  constructor(
    private readonly drizzle: DrizzleService,
    private readonly nsfw: NsfwService,
    private readonly deletePost: DeletePostUseCase,
    @Inject(mediaConfig.KEY) private readonly media: ConfigType<typeof mediaConfig>,
  ) {}

  async execute(job: ValidatePostFileImageJob): Promise<void> {
    const file = await this.drizzle.db.query.postFiles.findFirst({
      where: eq(postFiles.id, job.postFileId),
      columns: {
        id: true,
        postId: true,
        tusUploadId: true,
        uploadStatus: true,
        mimeType: true,
      },
    });

    if (!file || file.uploadStatus !== PostFileUploadStatus.PROCESSING) {
      return;
    }

    if (file.tusUploadId !== job.tusUploadId) {
      this.logger.warn(`Tus id mismatch for post file ${job.postFileId}`);
      return;
    }

    const filePath = nodePath.join(this.media.root, job.tusUploadId);

    try {
      const { safe, predictions } = await this.nsfw.isImageSafe(filePath);

      if (safe) {
        await this.drizzle.db
          .update(postFiles)
          .set({ uploadStatus: PostFileUploadStatus.READY })
          .where(eq(postFiles.id, job.postFileId));
        return;
      }

      this.logger.log(
        `Post ${file.postId} removed: NSFW check rejected file ${job.postFileId} (${predictions
          .filter((p) => p.probability >= 0.5)
          .map((p) => `${p.className}=${p.probability.toFixed(2)}`)
          .join(', ')})`,
      );

      await this.deletePost.execute(file.postId);
    } catch (err) {
      this.logger.error(
        `NSFW validation failed for post file ${job.postFileId}: ${err instanceof Error ? err.message : String(err)}`,
      );
      throw err;
    }
  }
}
