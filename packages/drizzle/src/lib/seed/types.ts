import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

import type * as schema from '../../schema';

export type DrizzleClient = NodePgDatabase<typeof schema>;

export type PackageSeed = {
  readonly name: string;
  readonly run: (tx: DrizzleClient) => Promise<void>;
};
