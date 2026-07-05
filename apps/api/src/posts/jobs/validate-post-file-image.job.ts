import { z } from 'zod';

export const validatePostFileImageJobSchema = z.object({
  postFileId: z.uuid(),
});

export type ValidatePostFileImageJob = z.infer<typeof validatePostFileImageJobSchema>;

export const VALIDATE_POST_FILE_IMAGE_JOB_NAME = 'validate' as const;
