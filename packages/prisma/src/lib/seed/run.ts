import type { PrismaClient } from '../../_generated/prisma/client';
import { prisma } from '../prisma';
import { linksSeed } from './links/seed';

/**
 * One entry per domain "package" (links, future modules, ...).
 * Order matters when seeds reference rows from an earlier package.
 */
const packageSeeds = [linksSeed];

async function seedDatabase(prisma: PrismaClient): Promise<void> {
  for (const pkg of packageSeeds) {
    await pkg.run(prisma);
  }
}

void seedDatabase(prisma)
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
