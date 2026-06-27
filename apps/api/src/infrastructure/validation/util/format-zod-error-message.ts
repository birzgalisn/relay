import { z } from 'zod';

export function formatZodErrorMessage(error: z.ZodError): string {
  return error.issues.map((issue) => issue.message).join(', ');
}
