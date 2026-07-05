import { AppError, isAppError } from '@repo/shared';
import { z } from 'zod';

import { TusError } from './tus.error';

/**
 * Normalizes a thrown value into a {@link TusError} and throws it, so tus hooks
 * always report a consistent HTTP status/body. Mirrors the GraphQL boundary:
 * validation funnels through {@link AppError}, and anything else (including an
 * already-built TusError) bubbles up untouched.
 */
export function toTusError(error: unknown): never {
  if (error instanceof z.ZodError) {
    throw TusError.fromAppError(AppError.zod(error));
  }

  if (isAppError(error)) {
    throw TusError.fromAppError(error);
  }

  throw error;
}
