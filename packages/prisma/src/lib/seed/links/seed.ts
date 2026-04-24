import { PackageSeed } from '../types';
import { LINK_SEEDS } from './data';

export const linksSeed = {
  name: 'links',
  async run(prisma) {
    const isSeeded = (await prisma.link.count()) > 0;

    if (isSeeded) {
      return;
    }

    for (const row of LINK_SEEDS) {
      await prisma.link.upsert({
        where: { id: row.id },
        create: { id: row.id, title: row.title, url: row.url, description: row.description },
        update: { title: row.title, url: row.url, description: row.description },
      });
    }
  },
} as const satisfies PackageSeed;
