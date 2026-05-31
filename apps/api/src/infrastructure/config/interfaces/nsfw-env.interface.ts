import { z } from 'zod';

export const nsfwEnvSchema = z.object({
  NSFW_BLOCK_THRESHOLD: z.coerce.number().min(0).max(1).default(0.75),
});

export type NsfwEnv = z.infer<typeof nsfwEnvSchema>;

export type NsfwEnvConfig = {
  blockThreshold: NsfwEnv['NSFW_BLOCK_THRESHOLD'];
};
