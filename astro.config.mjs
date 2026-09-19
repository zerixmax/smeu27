// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://suhamarina.eu',
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'hr',
        locales: {
          hr: 'hr',
          en: 'en',
          de: 'de',
        },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});