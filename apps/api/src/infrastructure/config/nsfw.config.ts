import { registerAs } from '@nestjs/config';

import { nsfwEnvSchema, type NsfwEnvConfig } from './interfaces/nsfw-env.interface';

export const nsfwConfig = registerAs<NsfwEnvConfig>('nsfw', () => {
  const env = nsfwEnvSchema.parse(process.env);

  return {
    blockThreshold: env.NSFW_BLOCK_THRESHOLD,
  };
});
