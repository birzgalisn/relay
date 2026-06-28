import { Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

import type { MediaStorageUpdatedPayload } from '../interfaces/media-storage-updated-payload.interface';
import type { MediaStorage } from '../models/media-storage.model';

const MEDIA_STORAGE_UPDATED = 'mediaStorageUpdated';

@Injectable()
export class MediaStoragePubSubService {
  private readonly pubSub = new PubSub();

  mediaStorageUpdated() {
    return this.pubSub.asyncIterableIterator<MediaStorageUpdatedPayload>(MEDIA_STORAGE_UPDATED);
  }

  async publish(status: MediaStorage): Promise<void> {
    await this.pubSub.publish(MEDIA_STORAGE_UPDATED, {
      mediaStorageUpdated: status,
    });
  }
}
