import type { APIRoute } from 'astro';
import { SHOW_TODOS } from '../data/site';

// The github.io preview is kept out of search engines (BaseLayout also adds noindex there). The launch
// build allows everything except the styleguide and points to the sitemap.
export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const sitemap = new URL(`${base}/sitemap-index.xml`, site);
  const body =
    SHOW_TODOS && !import.meta.env.DEV
      ? 'User-agent: *\nDisallow: /\n'
      : `User-agent: *\nDisallow: ${base}/styleguide/\n\nSitemap: ${sitemap.href}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
