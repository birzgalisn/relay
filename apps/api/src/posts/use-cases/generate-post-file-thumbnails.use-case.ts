import { Injectable, Logger } from '@nestjs/common';
import { DrizzleService, postFiles } from '@repo/drizzle';
import {
  getPostFileThumbnailStorageKey,
  isErrorLike,
  POST_FILE_THUMBNAIL_SIZES,
} from '@repo/shared';
import { eq } from 'drizzle-orm';
import sharp from 'sharp';

import { MediaService } from '../../infrastructure/media/services/media.service';
import type { UseCase } from '../../shared/interfaces/use-case.interface';

@Injectable()
export class GeneratePostFileThumbnailsUseCase implements UseCase<string, void> {
  private readonly logger = new Logger(GeneratePostFileThumbnailsUseCase.name);

  constructor(
    private readonly drizzle: DrizzleService,
    private readonly media: MediaService,
  ) {}

  async execute(postFileId: string): Promise<void> {
    const file = await this.drizzle.db.query.postFiles.findFirst({
      where: eq(postFiles.id, postFileId),
      columns: {
        id: true,
        storageKey: true,
        validatedAt: true,
      },
    });

    if (!file?.storageKey || file.validatedAt) {
      return;
    }

    const sourcePath = this.media.path(file.storageKey);

    for (const { size, width } of POST_FILE_THUMBNAIL_SIZES) {
      const storageKey = getPostFileThumbnailStorageKey({ postFileId, size });
      const destinationPath = this.media.path(storageKey);

      try {
        await sharp(sourcePath, { animated: false })
          .rotate()
          .resize({ width, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(destinationPath);
      } catch (err) {
        this.logger.error(
          `Thumbnail generation failed for post file ${postFileId} (${size}): ${isErrorLike(err) ? err.message : String(err)}`,
        );
        throw err;
      }
    }
  }
}
