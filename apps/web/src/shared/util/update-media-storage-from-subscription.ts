import type { SubscribeToMoreUpdateQueryFn } from '@apollo/client';

import type {
  MediaStorageQuery,
  MediaStorageQueryVariables,
  MediaStorageUpdatedSubscription,
} from '../data-access/media-storage.generated';

export const updateMediaStorageFromSubscription: SubscribeToMoreUpdateQueryFn<
  MediaStorageQuery,
  MediaStorageQueryVariables,
  MediaStorageUpdatedSubscription
> = (_prev, options) => {
  if (!options.complete) {
    return;
  }

  return {
    mediaStorage: options.subscriptionData.data.mediaStorageUpdated,
  } as const satisfies MediaStorageQuery;
};
