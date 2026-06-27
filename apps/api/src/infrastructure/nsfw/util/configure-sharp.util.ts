import sharp from 'sharp';

/** NSFW validation runs single-threaded; disable sharp cache to limit memory use. */
export function configureSharpForNsfw(): void {
  sharp.cache(false);
  sharp.concurrency(1);
}
