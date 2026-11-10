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
          hr: 'hr-HR',
          en: 'en-US',
          de: 'de-DE',
        },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});