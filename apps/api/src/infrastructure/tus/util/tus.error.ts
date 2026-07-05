import type { AppError } from '@repo/shared';

/** Error shape read by `@tus/server` from hook callbacks (`status_code`, `body`). */
export type TusErrorOptions = {
  statusCode: number;
  body: string;
  cause?: unknown;
};

export class TusError extends Error {
  readonly status_code: number;
  readonly body: string;

  constructor({ statusCode, body, cause }: TusErrorOptions) {
    super(body, cause ? { cause } : undefined);
    this.status_code = statusCode;
    this.body = body;
  }

  /** Maps a domain {@link AppError} onto the shape `@tus/server` understands. */
  static fromAppError(error: AppError): TusError {
    return new TusError({ statusCode: error.httpStatus, body: error.message, cause: error });
  }
}
