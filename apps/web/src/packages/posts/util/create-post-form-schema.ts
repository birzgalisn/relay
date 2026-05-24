import { z } from 'zod';

export const createPostFormSchema = z.object({
  caption: z.string().trim().max(4000),
  files: z.array(z.instanceof(File)).min(1, 'Add at least one file'),
});

export type CreatePostFormValues = z.infer<typeof createPostFormSchema>;
