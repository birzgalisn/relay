import { z } from 'zod';

import { MediaMimeType } from '../constants/media-mime-type.constants';
import { parseMediaMimeType } from '../util/media-mime-type.util';

export const supportedMediaMimeTypeSchema = z
  .string()
  .min(1, 'MIME type is required')
  .transform((value, ctx): MediaMimeType => {
    const parsed = parseMediaMimeType(value);

    if (!parsed) {
      ctx.addIssue({
        code: 'custom',
        message: `Unsupported file type: ${value}`,
      });
      return z.NEVER;
    }

    return parsed;
  });
