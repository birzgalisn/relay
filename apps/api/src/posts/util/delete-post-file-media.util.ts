import { getPostFileThumbnailStorageKeys } from '@repo/shared';

import type { MediaService } from '../../infrastructure/media/services/media.service';

type PostFileMedia = {
  id: string;
  storageKey: string | null;
};

export async function deletePostFileMedia(media: MediaService, file: PostFileMedia): Promise<void> {
  await Promise.all(
    [file.storageKey, ...getPostFileThumbnailStorageKeys(file.id)]
      .filter((key): key is string => key != null)
      .map((key) => media.delete(key)),
  );
}
