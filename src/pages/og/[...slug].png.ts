import type { APIRoute } from 'astro';
import { ogPages, renderOg, type OgPage } from '../../lib/og';

export async function getStaticPaths() {
  return (await ogPages()).map((page) => ({ params: { slug: page.slug }, props: { page } }));
}

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOg((props as { page: OgPage }).page);
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
