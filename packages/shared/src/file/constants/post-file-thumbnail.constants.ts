export const POST_FILE_THUMBNAIL_SIZES = [
  { size: 'sm', width: 320 },
  { size: 'md', width: 640 },
  { size: 'lg', width: 1280 },
] as const;

export type PostFileThumbnailSize = (typeof POST_FILE_THUMBNAIL_SIZES)[number]['size'];
