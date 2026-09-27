// Build-time Open Graph images, 1200×630 (site-plan §4.3): carbon background, wordmark, page title in
// Barlow Condensed, a flame rule line.
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { BRAND } from './brand';
import { getFamilies, getIndustries, getProducts } from './content';

const require = createRequire(import.meta.url);
const font = (p: string) => readFile(require.resolve(p));

let fonts: Promise<Parameters<typeof satori>[1]['fonts']> | undefined;
function loadFonts() {
  fonts ??= Promise.all([
    font('@fontsource/barlow-condensed/files/barlow-condensed-latin-700-normal.woff'),
    font('@fontsource/barlow-condensed/files/barlow-condensed-latin-600-normal.woff'),
    font('@fontsource/barlow/files/barlow-latin-400-normal.woff'),
  ]).then(([c700, c600, b400]) => [
    { name: 'Barlow Condensed', data: c700, weight: 700 as const, style: 'normal' as const },
    { name: 'Barlow Condensed', data: c600, weight: 600 as const, style: 'normal' as const },
    { name: 'Barlow', data: b400, weight: 400 as const, style: 'normal' as const },
  ]);
  return fonts;
}

export interface OgPage {
  slug: string; // "home", "products/crucibles"
  eyebrow: string;
  title: string;
}

/** Every page that gets its own OG image. Pages not listed fall back to the home image. */
export async function ogPages(): Promise<OgPage[]> {
  const [products, families, industries] = await Promise.all([getProducts(), getFamilies(), getIndustries()]);
  return [
    { slug: 'home', eyebrow: 'Manufacturer · Hyderabad, India', title: 'Ceramic fibre shapes & foundry consumables' },
    { slug: 'products', eyebrow: 'Products', title: 'Three product families' },
    { slug: 'custom-ceramic-fibre-shapes', eyebrow: 'Custom shapes', title: 'Custom ceramic fibre shapes, made to your drawing' },
    { slug: 'plant-and-quality', eyebrow: 'Plant & Quality', title: 'Made and checked in our own plant' },
    { slug: 'industries', eyebrow: 'Industries', title: 'Who we supply' },
    { slug: 'about', eyebrow: 'About', title: 'The maker behind the parts' },
    { slug: 'downloads', eyebrow: 'Downloads', title: 'Datasheets and documents' },
    { slug: 'request-a-quote', eyebrow: 'Request a quote', title: 'Tell us what you need' },
    { slug: 'contact', eyebrow: 'Contact', title: 'Talk to the plant' },
    { slug: 'privacy', eyebrow: 'Privacy', title: 'Privacy notice' },
    ...families.map((f) => ({ slug: `products/${f.id}`, eyebrow: `Product family ${f.data.letter}`, title: f.data.title })),
    ...products.map((p) => {
      const family = families.find((f) => f.id === p.data.family);
      return { slug: `products/${p.id}`, eyebrow: family?.data.title ?? 'Products', title: p.data.title };
    }),
    ...industries.map((i) => ({ slug: `industries/${i.id}`, eyebrow: 'Industries', title: i.data.title })),
  ];
}

/** The OG image slug for a page path (without base), e.g. "/products/crucibles/" → "products/crucibles". */
export async function ogSlugFor(path: string): Promise<string> {
  const slug = path.replace(/^\/|\/$/g, '') || 'home';
  return (await ogPages()).some((p) => p.slug === slug) ? slug : 'home';
}

// satori takes a React-like element tree; plain objects avoid a JSX dependency.
type Node = { type: string; props: Record<string, unknown> & { children?: unknown } };
const h = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({ type, props: { style, children } });

export async function renderOg(page: OgPage): Promise<Buffer> {
  const long = page.title.length > 48;
  const tree = h(
    'div',
    { width: 1200, height: 630, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: BRAND.carbon, padding: '64px 80px 56px' },
    [
      h('div', { display: 'flex', alignItems: 'baseline', gap: 16 }, [
        h('span', { fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 44, letterSpacing: '0.04em', color: BRAND.white }, 'INNOVAC'),
        h('span', { fontFamily: 'Barlow', fontSize: 18, letterSpacing: '0.3em', color: BRAND.ice }, 'CERAMIC'),
      ]),
      h('div', { display: 'flex', flexDirection: 'column', gap: 20 }, [
        h('span', { fontFamily: 'Barlow', fontSize: 22, letterSpacing: '0.2em', color: BRAND.ice, textTransform: 'uppercase' }, page.eyebrow),
        h(
          'span',
          { fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: long ? 76 : 96, lineHeight: 0.95, color: BRAND.white, textTransform: 'uppercase', maxWidth: 1040 },
          page.title,
        ),
      ]),
      h('div', { display: 'flex', flexDirection: 'column', gap: 18 }, [
        h('div', { display: 'flex', height: 4, width: 1040, backgroundColor: BRAND.lineDark }, [
          h('div', { display: 'flex', height: 4, width: 220, backgroundColor: BRAND.flame }),
        ]),
        h('span', { fontFamily: 'Barlow', fontSize: 22, color: BRAND.bodyOnDark }, 'innovacceramic.com · Made to your drawing'),
      ]),
    ],
  );
  const svg = await satori(tree as unknown as Parameters<typeof satori>[0], { width: 1200, height: 630, fonts: await loadFonts() });
  return new Resvg(svg).render().asPng();
}
