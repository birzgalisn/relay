import { statfs } from 'node:fs/promises';

import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { getUploadableFreeBytes, STORAGE_RESERVE_BYTES } from '@repo/shared';

import { mediaConfig } from '../../config/media.config';
import { TusError } from '../../tus/util/tus.error';
import { MediaStorage } from '../models/media-storage.model';
import { MediaStoragePubSubService } from './media-storage-pubsub.service';

@Injectable()
export class MediaStorageService {
  constructor(
    @Inject(mediaConfig.KEY) private readonly media: ConfigType<typeof mediaConfig>,
    private readonly mediaStoragePubSub: MediaStoragePubSubService,
  ) {}

  async getStatus(): Promise<MediaStorage> {
    const stats = await statfs(this.media.root);
    const blockSize = stats.bsize;
    const totalBytes = blockSize * stats.blocks;
    const availableBytes = blockSize * stats.bavail;
    const usedBytes = totalBytes - blockSize * stats.bfree;

    return {
      totalBytes,
      usedBytes,
      availableBytes,
      reserveBytes: STORAGE_RESERVE_BYTES,
      uploadAllowed: getUploadableFreeBytes(availableBytes) > 0,
    };
  }

  async publishCurrent(): Promise<void> {
    await this.mediaStoragePubSub.publish(await this.getStatus());
  }

  async assertUploadAllowed(requiredBytes: number): Promise<void> {
    const { availableBytes, reserveBytes } = await this.getStatus();
    const remainingAfterUpload = availableBytes - requiredBytes;

    if (remainingAfterUpload < reserveBytes) {
      throw new TusError(507, 'Not enough storage space. Please try again later.');
    }
  }
}
