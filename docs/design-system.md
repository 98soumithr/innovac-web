# Innovac Ceramic — Design System ("Blue Flame") v1.0

The look is the most important quality of this site. It has to feel like a serious engineering
manufacturer: dark, precise, confident, and fast. It must not resemble the Arivo Global site
(navy + burgundy, serif headlines, warm grey, meridian lines). Visual reference:
`docs/reference/homepage-mockup.html`.

**Design principles**
1. **Maker, not middleman.** Real plant and product photography, specific facts, visible quality checks.
2. **Engineered restraint.** One accent colour, hairline rules, 2px corners, no shadows, no gradients.
3. **Condensed authority.** Big uppercase condensed headlines, calm body text, monospace for data.
4. **Rhythm of heat and light.** Dark (carbon) and light (paper) sections alternate. Blue is the flame:
   small, bright, meaningful.
5. **Fast on a phone in a foundry.** Mobile first, zero JS by default, images under budget.

---

## 1. Colour tokens

Define these once in `src/styles/global.css` inside `@theme`. Components use token classes only.

| Token | Hex | Use |
|---|---|---|
| `carbon` | `#0F1115` | Dark section background, primary text on light |
| `carbon-2` | `#151920` | Raised dark band (proof strip, cards on dark) |
| `carbon-3` | `#1A1F28` | Photo placeholder, input on dark |
| `line-dark` | `#2A303B` | Hairlines and borders on dark |
| `line-dark-strong` | `#3A4250` | Outline buttons on dark |
| `text-on-dark` | `#FFFFFF` | Headlines on dark |
| `body-on-dark` | `#B9C0CC` | Body text on dark (10.3:1) |
| `muted-on-dark` | `#9AA3B2` | Labels, captions on dark (7.4:1) |
| `faint-on-dark` | `#8A93A3` | Smallest meta text on dark (6.1:1). Never darker than this for text |
| `flame` | `#1F5BF0` | THE accent: primary buttons, links on light, headline accent words, active states |
| `flame-hover` | `#1646C0` | Hover and pressed state of `flame` |
| `ice` | `#9CC2FF` | Accent **on dark only**: eyebrows, ticks, check marks, small highlights (10.4:1) |
| `paper` | `#F2F4F7` | Light section background |
| `white` | `#FFFFFF` | Cards, form sections |
| `line-light` | `#DDE2EA` | Card borders and hairlines on light |
| `field-border` | `#7A8494` | Form field borders and the upload drop zone (3.8:1 on white, meets the 3:1 rule for non-text UI) |
| `ink` | `#0F1115` | Headlines on light |
| `body` | `#4A5260` | Body text on light (7.2:1 on paper) |
| `caption` | `#5B6372` | Captions, eyebrow numbers on light (5.5:1) |

**Colour rules**
- `flame` covers **no more than about 10%** of any viewport. One solid flame element per viewport
  (usually the primary button or the Custom card).
- `flame` as **text on carbon** only at 24px and above (3.4:1). Smaller accent text on dark uses `ice`.
- Text on a `flame` fill is always white. White on flame is 5.5:1.
- `ice` is never used on light backgrounds.
- Section order alternates carbon and paper/white. Never put two carbon sections next to each other,
  except the footer directly after a carbon section.
- No gradients, glows, drop shadows or glassmorphism. The only "shadow" is the 2px focus ring.
- Focus ring: `outline: 2px solid ice` on dark and `2px solid flame` on light, with a 2px offset.

## 2. Typography

Self-host with Fontsource: `@fontsource/barlow-condensed` (600, 700), `@fontsource/barlow` (400, 500, 600),
`@fontsource-variable/jetbrains-mono`. Preload only the Barlow Condensed 700 and Barlow 400 latin subsets.
Use `font-display: swap` and set size-adjusted fallbacks to keep CLS near zero.

| Role | Font | Size (mobile → desktop) | Line height | Style |
|---|---|---|---|---|
| Display (H1) | Barlow Condensed 700 | `clamp(46px, 6.4vw, 92px)` | 0.95 | UPPERCASE, tracking −0.005em |
| H2 section | Barlow Condensed 700 | `clamp(36px, 4.2vw, 60px)` | 1.0 | UPPERCASE |
| H3 | Barlow Condensed 600 | `clamp(22px, 2vw, 28px)` | 1.05 | UPPERCASE, tracking 0.02em |
| Stat number | Barlow Condensed 600 | `clamp(34px, 3.6vw, 52px)` | 1.0 | |
| Lead | Barlow 400 | 18 → 20px | 1.55 | max 60ch |
| Body | Barlow 400 | 16 → 17px | 1.6 | max 68ch |
| Small | Barlow 400/500 | 14–15px | 1.5 | |
| Button | Barlow 600 | 16–17px | 1 | Sentence case |
| Eyebrow | JetBrains Mono 400 | 11 → 13px | 1.4 | UPPERCASE, tracking 0.18em |
| Data / specs | JetBrains Mono 400 | 13–14px | 1.5 | Tabular numbers |

**Type rules:** Headlines are uppercase condensed. Body text is never uppercase. One accent-coloured
phrase per H1 at most, with no accent colour in H2s except on the Plant & Quality section. Numbers and specs are
always set in mono. Don't mix more than three sizes in one component.

## 3. Layout

- **Grid:** 12 columns, 24px gutter, content max width 1280px. Side padding: 20px on mobile, 40px on
  tablet, 80px from 1280px up.
- **Breakpoints:** 390 (design base), 768, 1024, 1280, 1440.
- **Spacing scale (px):** 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96, 112.
- **Section padding:** 56px on mobile, 112px on desktop (block). The proof strip is 36px.
- **Radius:** 2px on everything. Circles only for step dots and icon buttons.
- **Borders:** 1px hairlines. Cards on light have `line-light` borders; on dark, `line-dark`.

## 4. Signature motifs (use them sparingly, which is what makes them work)

1. **Temperature ruler** (`<TemperatureRuler>`): a hairline scale with ticks every 100° from 0° to 1400°,
   labelled every 200°. The last three ticks are `flame`. It is decorative, so use `aria-hidden`.
   It appears **only in the home hero and the product-page hero**. It is a ruler, never a claim:
   it carries no product temperature.
2. **Section index eyebrow**: `01 — PRODUCTS`, `02 — PLANT & QUALITY`. On the homepage it is numbered;
   on inner pages it shows the section name only.
3. **Family letters**: product families are labelled `A`, `B`, `C` in mono with a hairline running to
   the right edge.
4. **Mono check lists**: quality checks use a row with the label on the left and `✓ checked` in `ice` on the right.
5. **Hatched photo placeholder**: a 135° hairline hatch on `carbon-3` (dark) or `#E3E7EE` (light) with a
   mono caption naming the exact photo needed. It is used only until real photos arrive.

## 5. Components (in `src/components/`)

| Component | Notes |
|---|---|
| `SiteHeader` | Carbon, 84px (64px on mobile), sticky, 1px `line-dark` bottom border. Wordmark on the left. On the right: Products, Custom shapes, Plant & Quality, Industries, Downloads, Contact, and a `Request a quote` flame button. Mobile shows a menu button that opens a full-screen carbon sheet. |
| `Wordmark` | `INNOVAC` in Barlow Condensed 700 with 0.04em tracking, and `CERAMIC` in mono with 0.2em tracking in `ice`. SVG version for the favicon and OG image. |
| `MobileActionBar` | Mobile only. Fixed to the bottom, 72px, carbon background. Two equal buttons: WhatsApp (outline) and Request quote (flame). Hidden on `/request-a-quote/`. Body gets bottom padding so content is never covered. |
| `Button` | Variants: `primary` (flame fill, white text), `outline-dark`, `outline-light`, `text`. Height 56px (large) or 44px (default). A trailing arrow icon is optional. |
| `Section` | Props `tone="carbon|paper|white"` and `id`. Applies padding, background and text colours. |
| `SectionHeader` | Eyebrow, H2, optional intro, with an optional right-aligned link. |
| `Hero` | Home: 7/5 split with the H1, lead, three actions (primary, outline, WhatsApp text link) and a photo with the "Quote reply" badge overlapping bottom-left. The ruler sits at the bottom. |
| `ProofStrip` | 4 stats on `carbon-2`, divided by `line-dark`. Values come from `site.ts`, and a stat whose value is missing is not rendered. |
| `ProductFamily` | Family letter, H3, hairline and "View all" link, then a 5-column grid of `ProductCard` (2 columns on mobile, or a list on the homepage at mobile width). |
| `ProductCard` | White card, 176px photo, name (Barlow 600, 18px), one-line summary. The whole card is the link. On hover the border turns `flame` and the image zooms to 1.02 (motion permitting). |
| `CustomCard` | The flame card that closes the insulation row: "Your shape, your drawing". It links to `/custom-ceramic-fibre-shapes/`. |
| `FeaturePanel` | A carbon panel spanning 4 columns inside a light grid, used for filter-candle applications. |
| `QualityChecks` | The mono check list, driven by `site.ts` → `qualityChecks`. |
| `FactTile` | A bordered tile holding a big value and a mono label (certificate, test report, capacity). |
| `IndustryTile` | White tile, condensed H3 and a mono product list. It links to the industry page. |
| `SpecTable` | An HTML `<table>` (never an image), mono values, header "Typical values", and a footnote with the test method. Rows whose value is null are hidden. |
| `SizesTable` | Standard sizes / part numbers. It scrolls horizontally inside its own container on mobile. |
| `FaqList` | `<details>`/`<summary>` rows with hairlines and a plus/minus icon. No JS. |
| `RfqForm` | See `site-plan.md` § Request a quote. Labels always visible, required fields marked with `*`, errors shown inline under the field in text plus colour. |
| `ContactPanel` | Carbon panel with WhatsApp, phone, email, plant address, GSTIN and a map facade (a static image that opens Google Maps; no iframe). |
| `RfqBand` | A full-width carbon band at the end of inner pages: H2 "Need a quote?", the primary button and WhatsApp. |
| `Breadcrumbs` | Mono, 12px, `caption` colour, with `/` separators. Also emitted as JSON-LD. |
| `PhotoFrame` | Wraps `astro:assets` `<Picture>` (AVIF and WebP, sizes set). With no `src` it shows the hatched placeholder and the caption `[PHOTO — …]`. |
| `TemperatureRuler`, `Eyebrow`, `Icon` | Icons are inline stroke SVG at 1.8px stroke with round caps: arrow-right, chevron, whatsapp-bubble, upload, download, menu, close, plus, minus, check. |

States: every interactive element gets default, hover, focus-visible, active and disabled states.
Links on light are `flame` with an underline on hover. Nav links on dark are `#D5DAE3` and turn white on hover.

## 6. Photography (this decides whether the site looks premium)

The current site uses AI-generated images. **All of them go.** Commission one day with an industrial
photographer in Hyderabad.

**Shot list (about 45 finals)**
- **Hero:** a wide plant-floor shot with finished parts on racks or pallets. Shoot a landscape
  (3:2) and a portrait (4:5) version for mobile. Light should come from one side.
- **Products:** 11 lines × 3 shots each:
  - (a) a clean studio shot on a seamless mid-grey `#D9DDE3`, 3/4 view from 30°, every product
    shot at the same angle and scale;
  - (b) a macro detail of the texture and edge;
  - (c) the product in use or in context: a spoon in a gloved hand, a cone at the tap hole, candles
    in racks.
- **Plant:** 6–8 shots: the floor, drying racks with finished goods only (never the forming stage or
  any process equipment that reveals the method), the QC bench with gauges and scales, stores,
  packing and dispatch.
- **People:** hands, PPE and measuring. Faces are optional and need consent.
- **Do not photograph** forming stations, moulds, screens, slurry tanks or anything that shows how
  parts are formed.

**Grading:** cool white balance (about 5000K), slightly desaturated, blacks lifted a little, so photos
sit naturally beside carbon and flame. Keep the same grade on every image.

**Formats:** 2400px long edge masters in `src/assets/images/`, rendered by `<Picture>` as AVIF and WebP.
Home hero under 180KB on mobile, cards under 60KB. File names are descriptive, e.g.
`ceramic-fibre-sampling-spoon-studio.jpg`.

## 7. Motion

- Sections fade and rise 8px on entering the viewport, 240ms ease-out, using CSS `animation-timeline: view()`
  where supported and no animation otherwise. No JS scroll libraries.
- Ruler ticks draw in once on load (400ms, staggered 15ms).
- Hover transitions 150ms. Disable all motion under `prefers-reduced-motion: reduce`.
- No carousels, sliders, autoplay video, parallax or cursor effects.

## 8. Voice

Professional, specific and brief. Write as the maker: "We make…", "Every batch is checked for…".
Sentences under 20 words. No superlatives, no "cutting-edge", no "one-stop solution", no
exclamation marks. Say what a product does for the foundry in concrete terms (cleaner sample,
reliable tap-out, less heat loss). Never describe how a product is formed.

## 9. What makes it NOT Arivo (keep this distinct)

| | Arivo Global | Innovac Ceramic |
|---|---|---|
| Palette | Coast navy `#192E5D`, burgundy `#7E0827`, warm grey | Carbon `#0F1115`, flame `#1F5BF0`, ice, paper |
| Type | Source Serif 4 + IBM Plex | Barlow Condensed + Barlow + JetBrains Mono |
| Headline style | Sentence case serif | UPPERCASE condensed sans |
| Motif | Meridian lines | Temperature ruler, family letters, mono checks |
| Mood | Institutional exporter | Engineering manufacturer |
Never import Arivo fonts, colours or components into this repo.
