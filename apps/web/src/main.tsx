import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { GraphqlProvider } from './apollo';
import { Router } from './router';

import './globals.css';

async function bootstrap() {
  const container = document.getElementById('root');

  if (!container) {
    throw new Error('Unable to mount application');
  }

  void createRoot(container).render(
    <StrictMode>
      <GraphqlProvider>
        <Router />
      </GraphqlProvider>
    </StrictMode>,
  );
}

void bootstrap();
