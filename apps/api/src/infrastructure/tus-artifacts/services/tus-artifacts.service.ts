import { rm } from 'node:fs/promises';
import * as nodePath from 'node:path';

import { Inject, Injectable, Logger } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';

import { mediaConfig } from '../../config/media.config';

/** Best-effort removal of Tus file-store binary + `.json` metadata (`@tus/file-store` layout) */
@Injectable()
export class TusArtifactsService {
  private readonly logger = new Logger(TusArtifactsService.name);

  constructor(@Inject(mediaConfig.KEY) private readonly media: ConfigType<typeof mediaConfig>) {}

  async remove(tusUploadId?: string | null): Promise<void> {
    if (!tusUploadId) {
      return;
    }

    const binaryPath = nodePath.join(this.media.root, tusUploadId);
    const metaPath = nodePath.join(this.media.root, `${tusUploadId}.json`);

    for (const artifactPath of [binaryPath, metaPath]) {
      try {
        await rm(artifactPath, { force: true });
      } catch (err) {
        this.logger.warn(
          `Could not remove Tus artifact at ${artifactPath}: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    }
  }
}
