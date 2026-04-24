import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './app';

import './globals.css';

async function bootstrap() {
  const container = document.getElementById('root');

  if (!container) {
    throw new Error('Unable to mount application');
  }

  const queryClient = new QueryClient();

  void createRoot(container).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>,
  );
}

void bootstrap();
