import { isErrorLike } from '@repo/shared';
import { DetailedError } from 'tus-js-client';

const UPLOAD_FAILED_MESSAGE = 'Could not upload file. Please try again.';

/**
 * Turns a tus-js-client failure into a plain Error for display. Prefers the
 * server's response body (our tus error body), passes through existing Errors,
 * and otherwise falls back to a generic upload message.
 */
export function formatTusFailure(error: unknown): Error {
  if (error instanceof DetailedError) {
    return new Error(error.originalResponse?.getBody()?.trim() || UPLOAD_FAILED_MESSAGE);
  }

  if (error instanceof Error) {
    return error;
  }

  return new Error(isErrorLike(error) ? error.message : UPLOAD_FAILED_MESSAGE);
}
