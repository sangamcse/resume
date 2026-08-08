import type { APIRoute } from 'astro';
import { site } from '../data/profile';

/**
 * An endpoint rather than a static public/ file, so the sitemap URL follows the deployment
 * target automatically instead of hardcoding a domain we are about to change.
 *
 * AI crawlers are welcome here, deliberately. A portfolio exists to be found, and in 2026 a
 * large share of the people looking are asking an assistant rather than a search engine.
 * There is a summary written for exactly that purpose at /llms.txt.
 */
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'PerplexityBot',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
];

export const GET: APIRoute = () => {
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    ...AI_CRAWLERS.flatMap((ua) => [`User-agent: ${ua}`, 'Allow: /', '']),
    `Sitemap: ${site.url}/sitemap.xml`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
