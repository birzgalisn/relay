import { z } from 'zod';

export const generatePostFileThumbnailsJobSchema = z.object({
  postFileId: z.uuid(),
});

export type GeneratePostFileThumbnailsJob = z.infer<typeof generatePostFileThumbnailsJobSchema>;

export const GENERATE_POST_FILE_THUMBNAILS_JOB_NAME = 'generate' as const;
