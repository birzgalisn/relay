import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from '../../schema';
import { loadDrizzleEnv } from '../config/drizzle-env.config';
import { postsSeed } from './posts/seed';

async function seedDatabase() {
  const { connectionString } = loadDrizzleEnv();

  const pool = new Pool({ connectionString });
  const db = drizzle({ client: pool, schema });

  const seeds = [postsSeed];

  try {
    await db.transaction(async (tx) => {
      for (const seed of seeds) {
        await seed.run(tx);
      }
    });
  } finally {
    await pool.end();
  }
}

void seedDatabase().catch((e) => {
  console.error(e);
  process.exit(1);
});
