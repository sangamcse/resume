// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://sangam.dev',

  // No integrations on purpose. The site is one page, so a sitemap integration would
  // generate a single-URL file — public/sitemap.xml is hand-written instead.
  integrations: [],

  build: {
    // Emit /page/index.html style output so URLs work without server config.
    format: 'directory',
  },
});
