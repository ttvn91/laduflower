// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import markdoc from '@astrojs/markdoc';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: 'https://laduflower.vercel.app',
  output: 'server',
  adapter: vercel(),
  // Keystatic must be loaded before React to handle its own admin routes properly?
  // Trying reorder and explicit vite resolution
  integrations: [keystatic(), react(), markdoc()],
  server: {
    host: '127.0.0.1',
    port: 4321
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ['nam.plus', '.nam.plus']
    },
    optimizeDeps: {
      exclude: ['@keystatic/astro']
    }
  }
});
