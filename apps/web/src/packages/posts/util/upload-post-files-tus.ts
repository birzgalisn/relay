import { DetailedError, Upload } from 'tus-js-client';

import { getPostFilesTusEndpoint } from './get-post-files-tus-endpoint';

function formatTusFailure(err: unknown): Error {
  if (err instanceof DetailedError) {
    const message = err.originalResponse?.getBody()?.trim();
    return new Error(message || 'Could not upload file. Please try again.');
  }

  if (err instanceof Error) {
    return err;
  }

  return new Error('Could not upload file. Please try again.');
}

export type UploadPostFilesProgress = {
  fileIndex: number;
  bytesUploaded: number;
  bytesTotal: number;
};

function uploadSingle(
  file: File,
  metadata: { postId: string; sortOrder: number },
  onProgress?: (bytesUploaded: number, bytesTotal: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const upload = new Upload(file, {
      endpoint: getPostFilesTusEndpoint(),
      chunkSize: 5 * 1024 * 1024,
      retryDelays: [0, 1000, 3000],
      metadata: {
        postId: metadata.postId,
        sortOrder: String(metadata.sortOrder),
        filename: file.name,
        filetype: file.type || 'application/octet-stream',
      },
      onProgress(bytesUploaded, bytesTotal) {
        onProgress?.(bytesUploaded, bytesTotal);
      },
      onError: (err) => reject(formatTusFailure(err)),
      onSuccess: () => resolve(),
    });
    upload.start();
  });
}

/** Upload all post files in parallel. `sortOrder` matches `fileIndex` for reserved DB slots. */
export async function uploadPostFiles(
  postId: string,
  files: File[],
  onProgress?: (p: UploadPostFilesProgress) => void,
): Promise<void> {
  await Promise.all(
    files.map((file, fileIndex) =>
      uploadSingle(file, { postId, sortOrder: fileIndex }, (bytesUploaded, bytesTotal) => {
        onProgress?.({ fileIndex, bytesUploaded, bytesTotal });
      }),
    ),
  );
}
