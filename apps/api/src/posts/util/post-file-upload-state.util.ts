import { PostFileUploadStatus } from '@repo/drizzle';

type PostFileUploadState = { uploadStatus: PostFileUploadStatus };

export function hasPendingPostFiles(files: PostFileUploadState[]): boolean {
  return files.some((file) => file.uploadStatus === PostFileUploadStatus.PENDING);
}

export function hasProcessingPostFiles(files: PostFileUploadState[]): boolean {
  return files.some((file) => file.uploadStatus === PostFileUploadStatus.PROCESSING);
}

export function hasFailedPostFiles(files: PostFileUploadState[]): boolean {
  return files.some((file) => file.uploadStatus === PostFileUploadStatus.FAILED);
}

export function allPostFilesReady(files: PostFileUploadState[]): boolean {
  return (
    files.length > 0 && files.every((file) => file.uploadStatus === PostFileUploadStatus.READY)
  );
}
