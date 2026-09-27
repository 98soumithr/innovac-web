// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Until launch the site is served from https://98soumithr.github.io/innovac-web/, so the deploy
// workflow sets BASE_PATH=/innovac-web. At launch (build-plan Phase 9) it is removed and base is '/'.
const base = process.env.BASE_PATH || '/';

// Old Hostinger URLs → new pages (site-plan §5). GitHub Pages can't send 301s, so Astro writes a
// redirect page (meta refresh + canonical) at each old path.
/** @type {Record<string, string>} */
const redirects = {
  '/about-us': '/about/',
  '/crucibles': '/products/crucibles/',
  '/tap-out-cones': '/products/tap-out-cones/',
  '/sleeves': '/products/insulating-exothermic-sleeves/',
  '/boards': '/products/ceramic-fibre-boards/',
  '/pouring-cups': '/products/pouring-cups/',
  '/gasket': '/products/ceramic-fibre-gaskets/',
  '/pipe-section': '/products/ceramic-fibre-pipe-sections/',
  '/shapes-for-burner-applications': '/products/burner-shapes/',
  '/high-temperature-ceramic-insulation': '/products/thermal-insulation/',
  '/high-temperature-ceramic-insulation-1': '/products/thermal-insulation/',
  '/high-temperature-ceramic-insulation-products': '/products/thermal-insulation/',
  '/high-temperature-ceramic-insulation-products-1': '/products/thermal-insulation/',
  '/high-temperature-ceramic-insulation-products-2': '/products/thermal-insulation/',
  '/high-temp-ceramic-insulation-products': '/products/thermal-insulation/',
};
// Astro prefixes the source paths with `base` but not the destinations.
const prefix = base.replace(/\/$/, '');
for (const from of Object.keys(redirects)) redirects[from] = prefix + redirects[from];

export default defineConfig({
  site: 'https://innovacceramic.com',
  base,
  output: 'static',
  trailingSlash: 'always',
  redirects,
  integrations: [
    sitemap({
      filter: (page) =>
        !/\/(styleguide|thank-you|404)\/?$/.test(new URL(page).pathname) &&
        !Object.keys(redirects).some((from) => new URL(page).pathname.endsWith(`${from}/`)),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
