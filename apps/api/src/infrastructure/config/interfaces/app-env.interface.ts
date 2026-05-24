import { z } from 'zod';

export const NodeEnv = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
} as const;

export const appEnvSchema = z.object({
  NODE_ENV: z
    .enum([NodeEnv.DEVELOPMENT, NodeEnv.PRODUCTION, NodeEnv.TEST])
    .default(NodeEnv.DEVELOPMENT),
});

export type AppEnv = z.infer<typeof appEnvSchema>;

export interface AppEnvConfig {
  nodeEnv: AppEnv['NODE_ENV'];
}

export type AppEnvNamespace = { app: AppEnvConfig };
