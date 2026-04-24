export const LINK_SEEDS = [
  {
    id: crypto.randomUUID(),
    title: 'Installation',
    url: 'https://turborepo.dev/docs/getting-started/installation',
    description: 'Get started with Turborepo in a few moments with',
  },
  {
    id: crypto.randomUUID(),
    title: 'Crafting',
    url: 'https://turborepo.dev/docs/crafting-your-repository',
    description: 'Architecting a monorepo is a careful process.',
  },
  {
    id: crypto.randomUUID(),
    title: 'Add Repositories',
    url: 'https://turborepo.dev/docs/getting-started/add-to-existing-repository',
    description:
      'Turborepo can be incrementally adopted into an existing repository, single or multi-package, to speed up the developer and CI workflows of the repository.',
  },
] as const;
