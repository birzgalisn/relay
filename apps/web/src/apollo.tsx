import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { PropsWithChildren } from 'react';

import { getGraphqlHttpUrl } from './shared/util/get-graphql-http-url';

const client = new ApolloClient({
  link: new HttpLink({ uri: getGraphqlHttpUrl() }),
  cache: new InMemoryCache(),
});

export function GraphqlProvider({ children }: PropsWithChildren) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
