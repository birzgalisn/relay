import type { z } from 'zod';

import { APP_ERROR_HTTP_STATUS, AppErrorCode } from './app-error-code';
import type { FieldError } from './field-error';
import { zodErrorToFieldErrors } from './zod-to-field-errors';

export type AppErrorOptions = {
  code: AppErrorCode;
  message: string;
  context?: Record<string, unknown>;
  cause?: unknown;
  fieldErrors?: FieldError[];
};

export type AppErrorInternalOptions = {
  context?: Record<string, unknown>;
  cause?: unknown;
};

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly httpStatus: number;
  readonly context?: Record<string, unknown>;
  readonly fieldErrors?: FieldError[];

  constructor({ code, message, context, cause, fieldErrors }: AppErrorOptions) {
    super(message, cause ? { cause } : undefined);
    this.code = code;
    this.httpStatus = APP_ERROR_HTTP_STATUS[code];
    this.context = context;
    this.fieldErrors = fieldErrors;
  }

  static notFound(message: string, context?: Record<string, unknown>): AppError {
    return new AppError({ code: AppErrorCode.NOT_FOUND, message, context });
  }

  static conflict(message: string, context?: Record<string, unknown>): AppError {
    return new AppError({ code: AppErrorCode.CONFLICT, message, context });
  }

  static badRequest(message: string, context?: Record<string, unknown>): AppError {
    return new AppError({ code: AppErrorCode.BAD_REQUEST, message, context });
  }

  /**
   * The only way to build a {@link AppErrorCode.VALIDATION} error: it always
   * carries per-field detail derived from the Zod failure, so `VALIDATION`
   * consistently means "these specific fields are invalid" and the client can
   * always map it onto form fields — no ambiguity, no field mapping.
   */
  static zod(error: z.ZodError): AppError {
    const fieldErrors = zodErrorToFieldErrors(error);

    return new AppError({
      code: AppErrorCode.VALIDATION,
      message:
        fieldErrors.map((fieldError) => fieldError.message).join(', ') || 'Validation failed',
      fieldErrors,
    });
  }

  static storageFull(message: string, context?: Record<string, unknown>): AppError {
    return new AppError({ code: AppErrorCode.STORAGE_FULL, message, context });
  }

  static serviceUnavailable(message: string, context?: Record<string, unknown>): AppError {
    return new AppError({ code: AppErrorCode.SERVICE_UNAVAILABLE, message, context });
  }

  static internal(message: string, options?: AppErrorInternalOptions): AppError {
    return new AppError({
      code: AppErrorCode.INTERNAL,
      message,
      context: options?.context,
      cause: options?.cause,
    });
  }
}
