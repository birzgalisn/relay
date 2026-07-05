import type { z } from 'zod';

import type { FieldError } from './field-error';

/**
 * Turns a {@link z.ZodError} into our flat {@link FieldError} contract.
 *
 * The Zod issue path becomes the field path verbatim (dot-joined), so no
 * per-field mapping is ever needed: the same schema keys used for validation
 * are the keys the client maps back onto its form.
 */
export function zodErrorToFieldErrors(error: z.ZodError): FieldError[] {
  return error.issues.map((issue) => ({
    path: issue.path.map((segment) => String(segment)).join('.'),
    message: issue.message,
  }));
}
