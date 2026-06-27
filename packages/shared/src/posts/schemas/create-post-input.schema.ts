import { z } from 'zod';

import { pluralize } from '../../util/pluralize';
import {
  CREATE_POST_CAPTION_MAX_LENGTH,
  POST_MAX_FILE_COUNT,
  POST_MIN_FILE_COUNT,
} from '../constants/post.constants';

export const createPostCaptionSchema = z
  .string()
  .trim()
  .max(
    CREATE_POST_CAPTION_MAX_LENGTH,
    `Caption must be ${CREATE_POST_CAPTION_MAX_LENGTH} characters or less`,
  );

export const createPostInputSchema = z.object({
  caption: createPostCaptionSchema.nullable().optional(),
  fileCount: z
    .number()
    .int()
    .min(
      POST_MIN_FILE_COUNT,
      `Add at least ${POST_MIN_FILE_COUNT} ${pluralize(POST_MIN_FILE_COUNT, 'file')}`,
    )
    .max(
      POST_MAX_FILE_COUNT,
      `Add at most ${POST_MAX_FILE_COUNT} ${pluralize(POST_MAX_FILE_COUNT, 'file')}`,
    ),
});

export type CreatePostInput = z.infer<typeof createPostInputSchema>;
