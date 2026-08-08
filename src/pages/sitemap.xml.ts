import type { APIRoute } from 'astro';
import { site } from '../data/profile';

/**
 * One page, so this is hand-rolled rather than pulling in @astrojs/sitemap to generate a
 * single entry. An endpoint rather than a static file so the URL follows the deployment
 * target through the domain move.
 */
export const GET: APIRoute = () => {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${site.url}/</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
