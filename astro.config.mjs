// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// URLs match the old Webflow site exactly: /about-us, /blog/<slug> (no trailing slash).
export default defineConfig({
  site: 'https://www.medicly.co.nz',
  trailingSlash: 'never',
  build: { format: 'file' },
  // Keep quotes exactly as written in the original copy (no automatic curly-quote conversion).
  markdown: { smartypants: false },
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
});
