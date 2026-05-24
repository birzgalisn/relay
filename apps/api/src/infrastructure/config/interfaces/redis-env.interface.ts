import { z } from 'zod';

export const redisEnvSchema = z.object({
  REDIS_URL: z.string().min(1),
});

export type RedisEnv = z.infer<typeof redisEnvSchema>;

export interface RedisEnvConfig {
  url: RedisEnv['REDIS_URL'];
}

export type RedisEnvNamespace = { redis: RedisEnvConfig };
