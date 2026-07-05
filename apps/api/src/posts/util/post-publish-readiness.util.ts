type PostFilePublishSlot = { storageKey: string | null };

export function allPostFilesReadyForPublish(files: PostFilePublishSlot[]): boolean {
  return files.length > 0 && files.every((file) => file.storageKey != null);
}
