export function isImageMimeType(mimeType: string | null | undefined): boolean {
  return mimeType?.startsWith('image/') ?? false;
}
