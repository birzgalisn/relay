import { z } from 'zod';

import { pluralize } from '../../util/pluralize';
import {
  POST_FILE_MAX_UPLOAD_BYTES,
  POST_FILE_MAX_UPLOAD_MIB,
} from '../constants/post-file-upload.constants';
import { POST_MAX_FILE_COUNT, POST_MIN_FILE_COUNT } from '../constants/post.constants';
import { createPostCaptionSchema } from './create-post-input.schema';

export const createPostFormSchema = z.object({
  caption: createPostCaptionSchema,
  files: z
    .array(z.instanceof(File), 'Must be a file')
    .min(
      POST_MIN_FILE_COUNT,
      `Add at least ${POST_MIN_FILE_COUNT} ${pluralize(POST_MIN_FILE_COUNT, 'file')}`,
    )
    .max(
      POST_MAX_FILE_COUNT,
      `Add at most ${POST_MAX_FILE_COUNT} ${pluralize(POST_MAX_FILE_COUNT, 'file')}`,
    )
    .refine(
      (files) => files.every((f) => f.size <= POST_FILE_MAX_UPLOAD_BYTES),
      `Each file must be ${POST_FILE_MAX_UPLOAD_MIB} MiB or smaller`,
    ),
});

export type CreatePostFormValues = z.infer<typeof createPostFormSchema>;
