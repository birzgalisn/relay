import { Upload } from 'tus-js-client';

import { formatTusFailure } from '../../../shared/util/format-tus-failure';
import { getPostFilesTusEndpoint } from './get-post-files-tus-endpoint';

export type UploadPostFilesProgress = {
  fileIndex: number;
  bytesUploaded: number;
  bytesTotal: number;
};

type UploadSingleInput = {
  file: File;
  metadata: { postId: string; sortOrder: number };
  onProgress?: (progress: { bytesUploaded: number; bytesTotal: number }) => void;
};

function uploadSingle({ file, metadata, onProgress }: UploadSingleInput): Promise<void> {
  return new Promise((resolve, reject) => {
    const upload = new Upload(file, {
      endpoint: getPostFilesTusEndpoint(),
      chunkSize: 5 * 1024 * 1024,
      retryDelays: [0, 1000, 3000],
      metadata: {
        postId: metadata.postId,
        sortOrder: String(metadata.sortOrder),
        mimeType: file.type,
      },
      onProgress(bytesUploaded, bytesTotal) {
        onProgress?.({ bytesUploaded, bytesTotal });
      },
      onError: (err) => reject(formatTusFailure(err)),
      onSuccess: () => resolve(),
    });
    upload.start();
  });
}

export type UploadPostFilesInput = {
  postId: string;
  files: File[];
  onProgress?: (p: UploadPostFilesProgress) => void;
};

/** Upload all post files in parallel. `sortOrder` matches `fileIndex` for reserved DB slots. */
export async function uploadPostFiles({
  postId,
  files,
  onProgress,
}: UploadPostFilesInput): Promise<void> {
  await Promise.all(
    files.map((file, fileIndex) =>
      uploadSingle({
        file,
        metadata: { postId, sortOrder: fileIndex },
        onProgress: ({ bytesUploaded, bytesTotal }) => {
          onProgress?.({ fileIndex, bytesUploaded, bytesTotal });
        },
      }),
    ),
  );
}
