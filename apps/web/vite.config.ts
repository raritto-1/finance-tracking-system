import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/finance-tracking-system/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@finance/core': path.resolve(__dirname, '../../packages/core/src'),
    },
  },
});