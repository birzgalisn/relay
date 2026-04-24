import type { PrismaClient } from '../../_generated/prisma/client';

export type PackageSeed = {
  readonly name: string;
  readonly run: (prisma: PrismaClient) => Promise<void>;
};
