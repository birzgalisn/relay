import { MediaMimeType } from './media-mime-type.constants';

/** File extensions for promoted media storage keys. */
export const SUPPORTED_MEDIA_MIME_TYPES = {
  [MediaMimeType.IMAGE_AVIF]: '.avif',
  [MediaMimeType.IMAGE_GIF]: '.gif',
  [MediaMimeType.IMAGE_HEIC]: '.heic',
  [MediaMimeType.IMAGE_HEIF]: '.heif',
  [MediaMimeType.IMAGE_JPEG]: '.jpg',
  [MediaMimeType.IMAGE_PNG]: '.png',
  [MediaMimeType.IMAGE_SVG_XML]: '.svg',
  [MediaMimeType.IMAGE_WEBP]: '.webp',
} as const satisfies Record<MediaMimeType, string>;
