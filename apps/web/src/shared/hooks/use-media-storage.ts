import { useQuery } from '@apollo/client/react';
import { getUploadableFreeBytes } from '@repo/shared';
import { useEffect, useEffectEvent } from 'react';

import {
  MediaStorageDocument,
  MediaStorageUpdatedDocument,
} from '../data-access/media-storage.generated';
import { updateMediaStorageFromSubscription } from '../util/update-media-storage-from-subscription';

export function useMediaStorage() {
  const { data, loading, error, subscribeToMore } = useQuery(MediaStorageDocument);

  const subscribeToUpdates = useEffectEvent(() => {
    return subscribeToMore({
      document: MediaStorageUpdatedDocument,
      updateQuery: updateMediaStorageFromSubscription,
    });
  });

  useEffect(() => {
    subscribeToUpdates();
  }, []);

  return {
    storage: data?.mediaStorage,
    loading: loading && !data,
    error,
    freeBytes: data?.mediaStorage ? getUploadableFreeBytes(data.mediaStorage.availableBytes) : null,
    uploadsBlocked: !!data?.mediaStorage && !data.mediaStorage.uploadAllowed,
    exceedsFreeSpace: (pendingBytes: number) => {
      if (!data?.mediaStorage) {
        return false;
      }

      return pendingBytes > getUploadableFreeBytes(data.mediaStorage.availableBytes);
    },
  } as const;
}
