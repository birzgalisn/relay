import { type IGraphQLConfig } from 'graphql-config';

export default {
  projects: {
    relay: {
      schema: 'apps/api/src/_generated/schema.graphql',
      documents: ['apps/web/src/**/*.graphql'],
    },
  },
} as const satisfies IGraphQLConfig;
