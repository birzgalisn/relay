import { z } from 'zod';

export const corsEnvSchema = z.object({
  CNAME: z.string().min(1),
});

export type CorsEnv = z.infer<typeof corsEnvSchema>;

export interface CorsEnvConfig {
  origin: true | string[];
  methods: string[];
  allowedHeaders: string[];
  exposedHeaders: string[];
}

export type CorsEnvNamespace = { cors: CorsEnvConfig };
