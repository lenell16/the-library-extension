import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { ViteAliases } from 'vite-aliases';
import relay from 'vite-plugin-relay';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/popup/index.html')
        // nested: resolve(__dirname, 'nested/index.html')
      }
    }
  },
  plugins: [
    ViteAliases({ useConfig: true, useTypescript: true }),
    react(),
    relay
  ]
});
