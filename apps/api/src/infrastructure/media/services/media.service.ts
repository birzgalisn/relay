import { rename, rm } from 'node:fs/promises';
import path from 'node:path';

import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { AppError } from '@repo/shared';

import { mediaConfig } from '../../config/media.config';

@Injectable()
export class MediaService {
  constructor(@Inject(mediaConfig.KEY) private readonly media: ConfigType<typeof mediaConfig>) {}

  url(storageKey: string | null | undefined): string | null {
    if (!storageKey) {
      return null;
    }

    return `${this.media.baseUrl}/media/${storageKey}`;
  }

  path(storageKey: string): string {
    return path.join(this.media.root, storageKey);
  }

  async promote({
    tusUploadId,
    storageKey,
  }: {
    tusUploadId: string;
    storageKey: string;
  }): Promise<void> {
    const source = path.join(this.media.root, tusUploadId);
    const destination = this.path(storageKey);

    try {
      await rename(source, destination);
    } catch (cause) {
      throw AppError.internal(`Could not store upload ${tusUploadId}`, { cause });
    }

    await Promise.all([
      this.deletePath(path.join(this.media.root, tusUploadId)),
      this.deletePath(path.join(this.media.root, `${tusUploadId}.json`)),
    ]);
  }

  async delete(storageKey: string | null | undefined): Promise<void> {
    if (!storageKey) {
      return;
    }

    await this.deletePath(this.path(storageKey));
  }

  private async deletePath(filePath: string): Promise<void> {
    try {
      await rm(filePath, { force: true });
    } catch {
      // Best-effort cleanup.
    }
  }
}
