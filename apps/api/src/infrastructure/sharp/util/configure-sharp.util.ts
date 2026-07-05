import { availableParallelism } from 'node:os';

import sharp from 'sharp';

/** Global sharp settings — call once at process startup before any image work. */
export function configureSharp(): void {
  sharp.cache(false);
  sharp.concurrency(Math.max(1, availableParallelism()));
}
