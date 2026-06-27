import { z } from 'zod';

export const postFileTusUploadMetadataSchema = z.object({
  postId: z.uuid('Post ID is required'),
  /** Tus metadata values are strings (e.g. `"0"`); `sortOrder` is 0-based from the client. */
  sortOrder: z.coerce
    .number('Must be a number')
    .int('Must be an integer')
    .min(0, 'Sort order must be 0 or greater'),
  filetype: z.string().min(1, 'MIME type is required'),
});

export type PostFileTusUploadMetadata = z.infer<typeof postFileTusUploadMetadataSchema>;
