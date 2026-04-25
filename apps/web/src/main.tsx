import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './app';
import { getGraphqlHttpUrl } from './shared/util/get-graphql-http-url';

import './globals.css';

async function bootstrap() {
  const container = document.getElementById('root');

  if (!container) {
    throw new Error('Unable to mount application');
  }

  const apolloClient = new ApolloClient({
    link: new HttpLink({ uri: getGraphqlHttpUrl() }),
    cache: new InMemoryCache(),
  });

  void createRoot(container).render(
    <StrictMode>
      <ApolloProvider client={apolloClient}>
        <App />
      </ApolloProvider>
    </StrictMode>,
  );
}

void bootstrap();
