import { z } from 'zod';

import { MEDIA_ROOT_PATH } from '../constants/media.constants';

export const mediaEnvSchema = z.object({
  API_BASE_URL: z.url(),
});

export type MediaEnv = z.infer<typeof mediaEnvSchema>;

export type MediaEnvConfig = {
  root: typeof MEDIA_ROOT_PATH;
  baseUrl: MediaEnv['API_BASE_URL'];
};

export type MediaEnvNamespace = { media: MediaEnvConfig };
