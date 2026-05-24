import { z } from 'zod';

export const drizzleEnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
});

export type DrizzleEnv = z.infer<typeof drizzleEnvSchema>;

export interface DrizzleEnvConfig {
  connectionString: DrizzleEnv['DATABASE_URL'];
}

export type DrizzleEnvNamespace = { drizzle: DrizzleEnvConfig };
