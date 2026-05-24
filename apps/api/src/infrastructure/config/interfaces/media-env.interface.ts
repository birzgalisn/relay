import { z } from 'zod';

export const mediaEnvSchema = z.object({
  TUS_MAX_UPLOAD_BYTES: z.coerce
    .number()
    .int()
    .positive()
    .max(512 * 1024 * 1024) // 512 MiB
    .default(20 * 1024 * 1024), // 20 MiB
  API_BASE_URL: z.url(),
});

export type MediaEnv = z.infer<typeof mediaEnvSchema>;

export type MediaEnvConfig = {
  root: '/relay-media';
  tusPath: '/files';
  maxUploadBytes: MediaEnv['TUS_MAX_UPLOAD_BYTES'];
  baseUrl: MediaEnv['API_BASE_URL'];
};

export type MediaEnvNamespace = { media: MediaEnvConfig };
