import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from '../schema';
import { drizzleEnvConfig } from './config/drizzle-env.config';

@Injectable()
export class DrizzleService implements OnModuleDestroy {
  private readonly pool: Pool;
  readonly db: ReturnType<typeof drizzle<typeof schema>>;

  constructor(@Inject(drizzleEnvConfig.KEY) config: ConfigType<typeof drizzleEnvConfig>) {
    this.pool = new Pool({ connectionString: config.connectionString });
    this.db = drizzle({ client: this.pool, schema });
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  async ping(): Promise<void> {
    await this.pool.query('SELECT 1');
  }
}
