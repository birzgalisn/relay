import * as nodePath from 'node:path';

import { Inject, Injectable, Logger } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { DrizzleService, PostFileUploadStatus, postFiles } from '@repo/drizzle';
import { eq } from 'drizzle-orm';

import { mediaConfig } from '../../infrastructure/config/media.config';
import { NsfwService } from '../../infrastructure/nsfw/nsfw.service';
import type { UseCase } from '../../infrastructure/shared/interfaces/use-case.interface';
import type { ValidatePostFileImageJob } from '../jobs/validate-post-file-image.job';

export type ValidatePostFileImageResult = {
  postId: string;
  postFileId: string;
  safe: boolean;
  reason: string;
};

@Injectable()
export class ValidatePostFileImageUseCase implements UseCase<
  ValidatePostFileImageJob,
  ValidatePostFileImageResult | null
> {
  private readonly logger = new Logger(ValidatePostFileImageUseCase.name);

  constructor(
    private readonly drizzle: DrizzleService,
    private readonly nsfw: NsfwService,
    @Inject(mediaConfig.KEY) private readonly media: ConfigType<typeof mediaConfig>,
  ) {}

  async execute(job: ValidatePostFileImageJob): Promise<ValidatePostFileImageResult | null> {
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
      return null;
    }

    if (file.tusUploadId !== job.tusUploadId) {
      this.logger.warn(`Tus id mismatch for post file ${job.postFileId}`);
      return null;
    }

    const filePath = nodePath.join(this.media.root, job.tusUploadId);

    try {
      const { safe, predictions } = await this.nsfw.isImageSafe(filePath);

      const predictionSummary = predictions
        .filter((p) => p.probability >= 0.5)
        .map((p) => `${p.className}=${p.probability.toFixed(2)}`)
        .join(', ');

      return {
        postId: file.postId,
        postFileId: job.postFileId,
        safe,
        reason: safe ? '' : `NSFW check rejected file ${job.postFileId} (${predictionSummary})`,
      };
    } catch (err) {
      this.logger.error(
        `NSFW validation failed for post file ${job.postFileId}: ${err instanceof Error ? err.message : String(err)}`,
      );
      throw err;
    }
  }
}
