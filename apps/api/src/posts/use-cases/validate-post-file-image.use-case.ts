import { Injectable, Logger } from '@nestjs/common';
import { DrizzleService, postFiles } from '@repo/drizzle';
import { isErrorLike } from '@repo/shared';
import { eq } from 'drizzle-orm';

import { MediaService } from '../../infrastructure/media/services/media.service';
import { NsfwService } from '../../infrastructure/nsfw/services/nsfw.service';
import type { UseCase } from '../../shared/interfaces/use-case.interface';

export type ValidatePostFileImageResult = {
  postId: string;
  postFileId: string;
  safe: boolean;
  reason: string;
};

@Injectable()
export class ValidatePostFileImageUseCase implements UseCase<
  string,
  ValidatePostFileImageResult | null
> {
  private readonly logger = new Logger(ValidatePostFileImageUseCase.name);

  constructor(
    private readonly drizzle: DrizzleService,
    private readonly nsfw: NsfwService,
    private readonly media: MediaService,
  ) {}

  async execute(postFileId: string): Promise<ValidatePostFileImageResult | null> {
    const file = await this.drizzle.db.query.postFiles.findFirst({
      where: eq(postFiles.id, postFileId),
      columns: {
        id: true,
        postId: true,
        storageKey: true,
        validatedAt: true,
      },
    });

    if (!file || file.validatedAt || !file.storageKey) {
      return null;
    }

    const filePath = this.media.path(file.storageKey);

    try {
      const { safe, predictions } = await this.nsfw.isImageSafe(filePath);

      const predictionSummary = predictions
        .filter((p) => p.probability >= 0.5)
        .map((p) => `${p.className}=${p.probability.toFixed(2)}`)
        .join(', ');

      return {
        postId: file.postId,
        postFileId: file.id,
        safe,
        reason: !safe ? `NSFW check rejected file ${file.id} (${predictionSummary})` : '',
      };
    } catch (err) {
      this.logger.error(
        `NSFW validation failed for post file ${file.id}: ${isErrorLike(err) ? err.message : String(err)}`,
      );
      throw err;
    }
  }
}
