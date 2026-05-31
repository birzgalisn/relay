import { ApolloProvider } from '@apollo/client/react';
import { PropsWithChildren } from 'react';

import { apolloClient } from './apollo-client';

export function GraphqlProvider({ children }: PropsWithChildren) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
