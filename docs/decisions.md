# Decisions

One line per decision, newest last.

- 2026-09-27 · Hosting is GitHub Pages (public repo `98soumithr/innovac-web`), not Vercel: the Hostinger account is lost and the domain is at GoDaddy.
- 2026-09-27 · The site is fully static. The RFQ form posts to Web3Forms instead of `/api/rfq`; Resend, Turnstile and Vercel Blob are dropped.
- 2026-09-27 · Until launch the site builds with `BASE_PATH=/innovac-web` for the github.io preview; every internal URL goes through `url()` in `src/lib/paths.ts`.
- 2026-09-27 · Old-URL redirects are static redirect pages (meta refresh + canonical), since Pages can't send 301s. `/about`, `/products`, `/contact` are dropped from the map.
- 2026-09-27 · At launch, keep the Hostinger MX and SPF records in GoDaddy DNS so any existing `@innovacceramic.com` mail keeps arriving.
- 2026-09-27 · Analytics: Cloudflare Web Analytics instead of Vercel Web Analytics (Phase 7).
- 2026-09-27 · The old live site stays on Hostinger until launch (Phase 9). No DNS changes before then.
- 2026-09-27 · Extra colour tokens from the approved mockup: `nav-link` #D5DAE3, `line-light-strong` #C9CFD9, `placeholder-light` #E3E7EE, `on-flame-muted` #E6EDFF, `field-bg` #F5F7FB. The mockup's #232833/#262C37 borders use `line-dark`.
- 2026-09-27 · The body font-size token is `copy` (`text-copy`), because `text-body` is the body colour.
- 2026-09-27 · `[[TODO]]` placeholders show in dev and on the preview build (`PUBLIC_SHOW_TODOS=true`); the preview is also noindex and disallowed in robots.txt.
- 2026-09-27 · RFQ: the form posts from the browser to Web3Forms (JSON, or multipart when files are attached). The access key comes from the Actions variable `PUBLIC_WEB3FORMS_KEY`. The drawing upload field shows only when `PUBLIC_WEB3FORMS_ATTACHMENTS=true` (paid plan); until then buyers are told to send drawings on WhatsApp or email with their reference, so no file is ever silently dropped.
- 2026-09-27 · The RFQ reference (`INV-YYMMDD-XXXX`) is made in the browser and shown on /thank-you/. The note under the button says "as soon as you send it" rather than "by email", since Web3Forms auto-replies need a paid plan.
- 2026-09-27 · `npm run build` is the preview build; `npm run build:launch` is the strict launch gate.
- 2026-09-27 · Analytics: GoatCounter (cookie-less, free, supports custom events) instead of Cloudflare Web Analytics, which has no custom events. Loaded only when the Actions variable `PUBLIC_GOATCOUNTER_CODE` is set.
- 2026-09-27 · OG images are rendered at build time with satori + resvg (Barlow fonts from Fontsource .woff files). Pages without their own image use /og/home.png.
- 2026-09-27 · JSON-LD emits only facts present in site.ts. LocalBusiness appears once an address is supplied; Product never has offers or ratings.
