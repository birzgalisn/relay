import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: isDev,
  },
  server: {
    host: true,
    port: 4000,
  },
  preview: {
    host: true,
    port: 4000,
  },
});
