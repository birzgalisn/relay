import { useEffect, useMemo, useRef } from 'react';

/**
 * Blob URLs for local file previews, cached per `File` instance.
 * Survives unrelated re-renders (caption edits, upload progress) without reloading images.
 */
export function useFilePreviewUrls(files: File[]): (string | null)[] {
  const cacheRef = useRef(new Map<File, string>());

  const urls = useMemo(() => {
    const cache = cacheRef.current;
    const currentFiles = new Set(files);

    for (const file of cache.keys()) {
      if (!currentFiles.has(file)) {
        const url = cache.get(file);
        if (url) {
          URL.revokeObjectURL(url);
        }
        cache.delete(file);
      }
    }

    return files.map((file) => {
      if (!file.type.startsWith('image/')) {
        return null;
      }
      const existing = cache.get(file);
      if (existing) {
        return existing;
      }
      const url = URL.createObjectURL(file);
      cache.set(file, url);
      return url;
    });
  }, [files]);

  useEffect(() => {
    const cache = cacheRef.current;
    return () => {
      for (const url of cache.values()) {
        URL.revokeObjectURL(url);
      }
      cache.clear();
    };
  }, []);

  return urls;
}
