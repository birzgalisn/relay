import type { TypePolicies } from '@apollo/client';

/**
 * `post(id)` reads from normalized `PostModel` entities (e.g. already loaded via `Posts`).
 */
export const apolloTypePolicies: TypePolicies = {
  Query: {
    fields: {
      post: {
        read(_, { args, toReference }) {
          const id = args?.id;
          if (typeof id !== 'string') {
            return undefined;
          }
          return toReference({ __typename: 'PostModel', id });
        },
      },
    },
  },
};
