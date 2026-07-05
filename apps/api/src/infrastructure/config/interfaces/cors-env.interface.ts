import { z } from 'zod';

export const corsEnvSchema = z.object({
  CNAME: z.string().min(1),
});

export type CorsEnv = z.infer<typeof corsEnvSchema>;

export interface CorsEnvConfig {
  cname: string;
}

export type CorsEnvNamespace = { cors: CorsEnvConfig };
