import { registerAs } from '@nestjs/config';

import { mediaEnvSchema, type MediaEnvConfig } from './interfaces/media-env.interface';

export const mediaConfig = registerAs<MediaEnvConfig>('media', () => {
  const env = mediaEnvSchema.parse(process.env);

  return {
    root: '/relay-media',
    tusPath: '/files',
    maxUploadBytes: env.TUS_MAX_UPLOAD_BYTES,
    baseUrl: env.API_BASE_URL,
  };
});
