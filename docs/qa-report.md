# QA report (Phase 8)

Run on 2026-09-27 against the preview build (`npm run build`: TODOs visible, noindex).

## Results

| Check | Result |
|---|---|
| `npm run check` (astro check, lint-copy, lint-tokens) | 0 errors, 0 warnings, 0 hints |
| `npm test` (Playwright, 39 tests) | All pass: every route 200, exactly one H1, no console errors, no serious/critical axe issues (WCAG 2.2 AA tags); 404; old-URL redirects; no-JS downloads filter; RFQ validation, pre-fill, mocked success and failure; RFQ keyboard order |
| `npm run seo` | 31 pages, 0 errors, 0 warnings (see `docs/seo-audit.md`) |
| Lighthouse mobile, local server (no gzip) | `/` 96–97 · family 98 · product 97 · RFQ 97 performance; 100 accessibility and best practices on all four. SEO shows 66 only because the preview is deliberately noindex (`is-crawlable`); every other SEO audit passes. |
| JS budget (< 30 KB gz, RFQ < 60 KB) | ≤ 1.8 KB gz on every page |
| CSS / HTML | 7.7 KB gz shared CSS; 3–10 KB gz HTML |
| Fonts | 6 latin woff2 files, ~21–23 KB each; two preloaded |
| Image budgets (hero < 180 KB, cards < 60 KB) | Not testable yet: no photos. `PhotoFrame` serves AVIF/WebP at 480–2400 px widths once photos are added; re-check at launch |
| Keyboard | Skip link, header, mobile menu (Enter opens, Esc closes and returns focus), RFQ fields in order, visible focus rings |
| `npm run build:launch` | Fails by design until the family and industry `[[TODO]]`s are filled (see below) |
| `npm audit --omit=dev` | 0 vulnerabilities |

| Lighthouse mobile, **live GitHub Pages preview** | `/` perf 99, LCP 1.8 s, CLS 0 · `/products/tap-out-cones/` perf 99, LCP 1.6 s, CLS 0 · a11y and best practices 100 · SEO 63 only from the preview's noindex |

The local server measured LCP at 2.1–2.4 s because it sends HTML uncompressed; the live preview (gzip + CDN)
is inside the 2.0 s budget. Re-measure after launch with real photos.

## What needs Innovac before launch

Full list: `docs/OUTSTANDING.md` (`npm run todo`). In short:

1. **Company facts** in `src/data/site.ts`: phone, WhatsApp number, sales email on the domain, plant address
   and map pin, GSTIN, CIN (optional), year founded, capacity, plants supplied, quote reply time, hours,
   LinkedIn / IndiaMART / Google Business Profile URLs.
2. **Quality checks actually run** (label, method or instrument, frequency) and any certificates held.
3. **Per product**: confirm it is made in-house, standard sizes, grades and publishable typical values,
   crucible material. Then remove the TODO line and set `draft: false`.
4. **Family and industry pages**: the one TODO line in each (sizes, grades, temperature limits).
5. **Photos** (design-system §6): hero, 11 × 3 product shots, plant, QC, packing.
6. **Accounts**: Web3Forms access key (and a decision on paid attachments), GoatCounter code, GoDaddy login
   for the DNS switch, Google Search Console.
7. **Privacy notice** review.
