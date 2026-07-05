import { SUPPORTED_MEDIA_MIME_TYPES } from '../constants/media-mime-type-extensions.constants';
import { MediaMimeType } from '../constants/media-mime-type.constants';

function isKnownMediaMimeType(value: string): value is MediaMimeType {
  return value in SUPPORTED_MEDIA_MIME_TYPES;
}

export function parseMediaMimeType(mimeType: string | null | undefined): MediaMimeType | null {
  if (!mimeType) {
    return null;
  }

  const [baseMimeType] = mimeType.split(';', 1);
  const normalized = baseMimeType?.trim().toLowerCase();

  if (!normalized || !isKnownMediaMimeType(normalized)) {
    return null;
  }

  return normalized;
}

export function isSupportedMediaMimeType(mimeType: string | null | undefined): boolean {
  return parseMediaMimeType(mimeType) != null;
}

export function getMediaMimeTypeExtension(mimeType: string | null | undefined): string | null {
  const parsed = parseMediaMimeType(mimeType);
  return parsed ? SUPPORTED_MEDIA_MIME_TYPES[parsed] : null;
}

export function getMediaStorageKey({
  postFileId,
  mimeType,
}: {
  postFileId: string;
  mimeType: string | null | undefined;
}): string | null {
  const extension = getMediaMimeTypeExtension(mimeType);
  return extension ? `${postFileId}${extension}` : null;
}
