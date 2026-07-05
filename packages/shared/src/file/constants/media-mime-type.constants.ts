export enum MediaMimeType {
  IMAGE_AVIF = 'image/avif',
  IMAGE_GIF = 'image/gif',
  IMAGE_HEIC = 'image/heic',
  IMAGE_HEIF = 'image/heif',
  IMAGE_JPEG = 'image/jpeg',
  IMAGE_PNG = 'image/png',
  IMAGE_SVG_XML = 'image/svg+xml',
  IMAGE_WEBP = 'image/webp',
}

const mediaMimeTypeValues = Object.values(MediaMimeType) as [MediaMimeType, ...MediaMimeType[]];

export const SUPPORTED_MEDIA_MIME_TYPE_VALUES = mediaMimeTypeValues;
