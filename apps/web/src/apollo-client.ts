import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { Kind, OperationTypeNode } from 'graphql';
import { createClient } from 'graphql-ws';

import { apolloTypePolicies } from './apollo-type-policies';
import { getGraphqlHttpUrl } from './shared/util/get-graphql-http-url';
import { getGraphqlWsUrl } from './shared/util/get-graphql-ws-url';

const httpLink = new HttpLink({
  uri: getGraphqlHttpUrl(),
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: getGraphqlWsUrl(),
  }),
);

const link = ApolloLink.split(
  ({ query }) => {
    const def = getMainDefinition(query);

    return (
      def.kind === Kind.OPERATION_DEFINITION && def.operation === OperationTypeNode.SUBSCRIPTION
    );
  },
  wsLink,
  httpLink,
);

export const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache({ typePolicies: apolloTypePolicies }),
});
