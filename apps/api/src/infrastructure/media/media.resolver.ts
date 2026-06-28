import { Query, Resolver, Subscription } from '@nestjs/graphql';

import type { MediaStorageUpdatedPayload } from './interfaces/media-storage-updated-payload.interface';
import { MediaStorage } from './models/media-storage.model';
import { MediaStoragePubSubService } from './services/media-storage-pubsub.service';
import { GetMediaStorageUseCase } from './use-cases/get-media-storage.use-case';

@Resolver()
export class MediaResolver {
  constructor(
    private readonly getMediaStorage: GetMediaStorageUseCase,
    private readonly mediaStoragePubSub: MediaStoragePubSubService,
  ) {}

  @Query(() => MediaStorage)
  mediaStorage(): Promise<MediaStorage> {
    return this.getMediaStorage.execute();
  }

  @Subscription(() => MediaStorage, {
    resolve: (payload: MediaStorageUpdatedPayload) => payload.mediaStorageUpdated,
  })
  mediaStorageUpdated() {
    return this.mediaStoragePubSub.mediaStorageUpdated();
  }
}
