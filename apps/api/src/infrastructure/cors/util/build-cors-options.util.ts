import { NodeEnv, type AppEnvConfig } from '../../config/interfaces/app-env.interface';
import { corsEnvSchema, type CorsEnvConfig } from '../../config/interfaces/cors-env.interface';
import { CORS_HEADERS } from '../constants/cors.constants';

export function buildCorsOptions(app: AppEnvConfig): CorsEnvConfig {
  if (app.nodeEnv !== NodeEnv.PRODUCTION) {
    return { origin: true, ...CORS_HEADERS };
  }

  const { CNAME } = corsEnvSchema.parse(process.env);
  const webAppHost = `app.${CNAME}`;

  return {
    origin: [`https://${webAppHost}`, `http://${webAppHost}`],
    ...CORS_HEADERS,
  };
}
