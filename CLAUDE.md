# Innovac Ceramic — website

Marketing site for **Innovac Ceramic Pvt Ltd**, a manufacturer in Hyderabad, India, of ceramic fibre
shapes and foundry consumables. Buyers are foundries, steel plants, process plants and furnace builders.
Goal of every page: a qualified **Request a quote** (form or WhatsApp).

## Read before working
- `docs/design-system.md` — tokens, type, components, imagery. **The look is the top priority.**
- `docs/site-plan.md` — sitemap, page specs, SEO rules, keyword map, redirects.
- `docs/build-plan.md` — phases and acceptance checks. Work one phase at a time.
- `docs/reference/homepage-mockup.html` — the approved visual reference (open it in a browser, or screenshot it).

## Stack
Astro (current stable) · TypeScript strict · Tailwind CSS v4 (`@tailwindcss/vite`, tokens in `@theme`)
· Astro content collections (`src/content.config.ts`, zod) · `astro:assets` for images · self-hosted fonts
via Fontsource · `@astrojs/vercel` adapter (site is static; only `src/pages/api/*` runs on the server)
· `@astrojs/sitemap` · Resend (email) · Cloudflare Turnstile (spam) · Vercel Blob (drawing uploads).

## Commands
- `npm run dev` — dev server on :4321
- `npm run build` — must pass before any commit
- `npm run check` — `astro check` + `scripts/lint-copy.mjs` + `scripts/lint-tokens.mjs`
- `npm run todo` — lists every `[[TODO: …]]` placeholder into `docs/OUTSTANDING.md`
- `npm run shots` — Playwright screenshots of every route at 390px and 1440px into `.shots/`

## Hard rules (never break)
1. **Never mention the forming process.** No "vacuum", "vacuum-formed", "wet forming", "slurry" or any
   description of how products are made: not in copy, alt text, meta, JSON-LD, file names or PDFs.
   `scripts/lint-copy.mjs` fails the build on these words.
2. **Filter candles are "Hot gas filtration"**, never foundry consumables.
3. **No invented facts.** Numbers, certificates, client names, testimonials and temperatures come only from
   `src/data/site.ts` or content files. Missing facts are `[[TODO: what is needed]]` placeholders.
   No testimonials at all until real, attributable ones are supplied.
4. **No hex values in components.** Colours only via Tailwind token classes defined in
   `src/styles/global.css`. `scripts/lint-tokens.mjs` enforces this.
5. **No AI-generated or stock photos.** Use `<PhotoFrame>` in placeholder mode until real photos exist.
6. Zero client JS by default. Allowed islands: mobile menu, RFQ form, downloads filter. No sliders or carousels.
7. Indian English spelling (fibre, colour, metre). Professional tone: short sentences, no superlatives
   ("world-class", "leading", "best-in-class"), no exclamation marks.
8. Accessibility: WCAG 2.2 AA. Real `<button>`/`<a>`, visible focus ring, 44px touch targets, alt text on
   every meaningful image, `prefers-reduced-motion` respected.
9. Do not link to or mention Arivo Global unless `site.ts` says `arivo.linkFromInnovac: true`.

## How to work
- Content lives in `src/content/**` and `src/data/site.ts`; templates never hard-code product copy.
- Adding a product = adding one markdown file in `src/content/products/`. Never add a page file for it.
- After UI work: run `npm run shots` and compare against `docs/reference/homepage-mockup.html`
  at the same width. Fix spacing and type differences before moving on.
- Finish every phase with `npm run build && npm run check` passing, then commit with the phase name.
- Keep this file short. Put details in `docs/`.
