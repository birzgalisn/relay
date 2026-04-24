import { defineConfig, env } from 'prisma/config';

/**
 * `prisma generate` does not connect to the database. During image builds and
 * other environments where `DATABASE_URL` is unset, `env('DATABASE_URL')`
 * would throw (PrismaConfigEnvError). Use a placeholder URL only for loading
 * the config; migrate/deploy/seed and the app still require a real URL at
 * runtime.
 */
const datasourceUrl = process.env.DATABASE_URL
  ? env('DATABASE_URL')
  : 'postgresql://prisma:prisma@127.0.0.1:5432/prisma?schema=public';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'node ./dist/lib/seed/run.js',
  },
  datasource: {
    url: datasourceUrl,
  },
});
