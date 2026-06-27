import type { FieldPolicy, Reference, TypePolicies } from '@apollo/client';
import type { FieldMergeFunctionOptions, FieldReadFunctionOptions } from '@apollo/client/cache';

import type {
  PostQuery,
  PostsQuery,
  PostsQueryVariables,
} from './packages/posts/data-access/posts.generated';

type Post = NonNullable<PostQuery['post']>;
type PostPage = NonNullable<PostsQuery['posts']>;

const postsFieldPolicy: FieldPolicy<
  PostPage,
  PostPage,
  PostPage,
  FieldReadFunctionOptions,
  FieldMergeFunctionOptions<PostsQueryVariables>
> = {
  keyArgs: ['pageSize'],
  merge(existing, incoming, { args }) {
    if (!existing || !args?.cursor) {
      return incoming;
    }
    const seen = new Set(existing.nodes.map((node) => node.id));
    return {
      ...incoming,
      nodes: [...existing.nodes, ...incoming.nodes.filter((node) => !seen.has(node.id))],
    };
  },
};

const postFieldPolicy: FieldPolicy<Post, Post, Reference | undefined> = {
  read(_existing, { args, toReference }) {
    if (typeof args?.id !== 'string') {
      return undefined;
    }
    return toReference({ __typename: 'Post', id: args.id });
  },
};

export const apolloTypePolicies: TypePolicies = {
  Query: {
    fields: {
      posts: postsFieldPolicy,
      post: postFieldPolicy,
    },
  },
};
