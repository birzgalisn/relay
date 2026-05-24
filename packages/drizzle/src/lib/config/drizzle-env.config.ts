import { registerAs } from '@nestjs/config';
import 'dotenv/config';

import { drizzleEnvSchema, type DrizzleEnvConfig } from './interfaces/drizzle-env.interface';

export function loadDrizzleEnv(): DrizzleEnvConfig {
  const env = drizzleEnvSchema.parse(process.env);

  return {
    connectionString: env.DATABASE_URL,
  };
}

export const drizzleEnvConfig = registerAs<DrizzleEnvConfig>('drizzle', loadDrizzleEnv);
