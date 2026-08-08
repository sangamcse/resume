// @ts-check
import { defineConfig } from 'astro/config';

/*
  Deployment target. These two lines are the only place the URL shape is defined —
  everything else derives from import.meta.env.SITE and BASE_URL, so moving domains
  needs no path edits anywhere else.

  Currently: GitHub Pages project site at https://sangamcse.github.io/resume/

  To move to the apex domain (see "Moving to the apex domain" in README.md):
    site: 'https://sangam.dev'
    base: '/'
*/
export default defineConfig({
  site: 'https://sangamcse.github.io',
  base: '/resume',

  // No integrations on purpose. The site is one page, so a sitemap integration would
  // generate a single-URL file; src/pages/sitemap.xml.ts does it without a dependency.
  integrations: [],

  build: {
    // Emit /page/index.html style output so URLs work without server config.
    format: 'directory',
  },
});
