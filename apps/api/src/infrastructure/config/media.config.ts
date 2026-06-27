import { registerAs } from '@nestjs/config';

import { MEDIA_ROOT_PATH } from './constants/media.constants';
import { mediaEnvSchema, type MediaEnvConfig } from './interfaces/media-env.interface';

export const mediaConfig = registerAs<MediaEnvConfig>('media', () => {
  const env = mediaEnvSchema.parse(process.env);

  return {
    root: MEDIA_ROOT_PATH,
    baseUrl: env.API_BASE_URL,
  };
});
