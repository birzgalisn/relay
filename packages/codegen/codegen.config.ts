import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { CodegenConfig } from '@graphql-codegen/cli';

const here = path.dirname(fileURLToPath(import.meta.url));

const schema = path.resolve(here, '../../apps/api/src/_generated/schema.graphql');
const webSrc = path.resolve(here, '../../apps/web/src');
const webGraphqlTypes = path.resolve(here, '../../apps/web/src/_generated/graphql-types.ts');

const scalars = { DateTime: 'string' } as const;

const config = {
  schema,
  ignoreNoDocuments: true,
  generates: {
    [webGraphqlTypes]: {
      schema,
      plugins: ['typescript'],
      config: {
        scalars,
        skipTypename: false,
      },
    },
    [webSrc]: {
      schema,
      documents: path.join(webSrc, '**/*.graphql'),
      preset: 'near-operation-file',
      presetConfig: {
        baseTypesPath: '_generated/graphql-types.ts',
        extension: '.generated.ts',
      },
      plugins: ['typescript-operations', 'typed-document-node'],
      config: {
        enumsAsConst: true,
        scalars,
      },
    },
  },
  hooks: {
    afterAllFileWrite: ['oxfmt'],
  },
} satisfies CodegenConfig;

export default config;
