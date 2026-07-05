import { supportedMediaMimeTypeSchema } from '@repo/shared';
import { z } from 'zod';

export const finishPostFileUploadInputSchema = z.object({
  tusUploadId: z.string().min(1),
  byteSize: z.number().int().nonnegative().nullable(),
  postId: z.uuid('Post ID is required'),
  sortOrder: z.coerce
    .number('Must be a number')
    .int('Must be an integer')
    .min(0, 'Sort order must be 0 or greater'),
  mimeType: supportedMediaMimeTypeSchema,
});

export type FinishPostFileUploadInput = z.infer<typeof finishPostFileUploadInputSchema>;
