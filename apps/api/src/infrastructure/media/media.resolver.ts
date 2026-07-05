import { Query, Resolver, Subscription } from '@nestjs/graphql';

import type { MediaStorageUpdatedPayload } from './interfaces/media-storage-updated-payload.interface';
import { MediaStorage } from './models/media-storage.model';
import { MediaStoragePubSubService } from './services/media-storage-pubsub.service';
import { MediaStorageService } from './services/media-storage.service';

@Resolver()
export class MediaResolver {
  constructor(
    private readonly mediaStorageService: MediaStorageService,
    private readonly mediaStoragePubSub: MediaStoragePubSubService,
  ) {}

  @Query(() => MediaStorage)
  mediaStorage(): Promise<MediaStorage> {
    return this.mediaStorageService.readStorageCapacity();
  }

  @Subscription(() => MediaStorage, {
    resolve: (payload: MediaStorageUpdatedPayload) => payload.mediaStorageUpdated,
  })
  mediaStorageUpdated() {
    return this.mediaStoragePubSub.mediaStorageUpdated();
  }
}
