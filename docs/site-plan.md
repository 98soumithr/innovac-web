# Innovac Ceramic — Site Plan, Page Specs & SEO

## 1. Sitemap and URLs

Trailing slashes are on everywhere (`trailingSlash: 'always'`). Slugs carry the search keyword. Products
sit flat under `/products/`, so a product can change family without its URL changing.

```
/                                          Home
/products/                                 All products (3 families)
/products/foundry-consumables/             Family
/products/hot-gas-filtration/              Family
/products/thermal-insulation/              Family
/products/ceramic-fibre-sampling-spoons/   Product  (A)
/products/tap-out-cones/                   Product  (A)
/products/pouring-cups/                    Product  (A)
/products/insulating-exothermic-sleeves/   Product  (A)
/products/crucibles/                       Product  (A)
/products/ceramic-filter-candles/          Product  (B)
/products/ceramic-fibre-boards/            Product  (C)
/products/ceramic-fibre-pipe-sections/     Product  (C)
/products/ceramic-fibre-gaskets/           Product  (C)
/products/burner-shapes/                   Product  (C)
/custom-ceramic-fibre-shapes/              Custom / made to drawing
/plant-and-quality/                        Plant & Quality
/industries/                               Industries hub
/industries/iron-foundries/                Grey & SG iron foundries
/industries/steel-foundries-and-steel-plants/
/industries/non-ferrous-foundries/
/industries/glass-cement-and-process-plants/
/industries/furnace-and-kiln-builders/
/about/
/downloads/
/request-a-quote/                          Full RFQ form (?product=<slug> pre-fills)
/contact/
/privacy/                                  Required: DPDP Act 2023 (the form collects personal data)
/thank-you/                                noindex; the conversion page
/404
/styleguide/                               noindex, disallowed in robots.txt; visual QA of every component
Phase 2: /insights/ and /insights/<slug>/  Articles (see §7)
```

**Routing note:** families and products share `/products/[slug]/`. One `src/pages/products/[slug].astro`
builds its `getStaticPaths` from both collections and renders `FamilyPage` or `ProductPage`.

## 2. Global elements
- Header, footer, `MobileActionBar` and `RfqBand` appear on every page (except that `RfqBand` is hidden on
  `/request-a-quote/`, `/contact/` and `/thank-you/`).
- **WhatsApp:** `https://wa.me/<E164 without +>?text=<encoded>`. The default text is "Hello Innovac, I'd like a
  quote." On a product page it is "Hello Innovac, I'd like a quote for {product name}." The number
  comes from `site.ts`.
- The footer shows company name, plant address, GSTIN, CIN (if provided), phone, email, the family links,
  company links and `© {year}`.

## 3. Page specs

### Home `/` (section order is fixed; see the mockup)
1. **Hero** (carbon): eyebrow `MANUFACTURER · HYDERABAD, INDIA`. H1 "Ceramic fibre shapes & foundry consumables. *Made to
   your drawing.*" Lead text (one sentence naming the product lines). Buttons: `Send your drawing` →
   `/request-a-quote/`, `Browse products` → `/products/`, and a WhatsApp link. On the right, the hero
   photo with the quote-reply badge. The temperature ruler sits along the bottom.
2. **Proof strip** (carbon-2): year founded, capacity, plants supplied, number of product lines. All four
   come from `site.ts`, and a stat with no value is not rendered.
3. **Products** (paper): `01 — PRODUCTS`, "Three product families". Family A has 5 cards. Family B has the
   candle card plus a FeaturePanel of application industries. Family C has 4 cards plus the CustomCard.
4. **Plant & Quality** (carbon): `02 — PLANT & QUALITY`, "Made and checked *in our own plant*". A photo
   mosaic (1 wide, 2 small), a short paragraph, the QualityChecks list, and two FactTiles (certificate and test report).
5. **Industries** (paper): `03 — INDUSTRIES`, "Who we supply". 5 IndustryTiles linking to industry pages.
6. **Request a quote** (white): `04 — REQUEST A QUOTE`. The inline RfqForm (compact) next to the ContactPanel.
7. Footer.

### Product page `/products/<slug>/` (one template, content from markdown)
1. Breadcrumbs: Products / {Family} / {Product}.
2. **Product hero** (carbon), 6/6 split. Left side:
   - eyebrow with the family name;
   - H1 with the product name, keyword first (e.g. "Ceramic fibre sampling spoons");
   - a 2-sentence summary;
   - up to 3 "key fact" chips (mono), each only if the content provides it;
   - buttons: `Request a quote` (pre-filled with `?product=<slug>`) and WhatsApp (pre-filled).
   Right side: the main photo, with two thumbnails underneath. The ruler sits along the bottom.
3. **What it does** (white): 2–3 short paragraphs in foundry terms, next to a "Where it's used" list.
4. **Specifications** (paper, *optional*; rendered only when `specs` is present):
   - SpecTable with the header "Typical values", which are not guaranteed minimums;
   - SizesTable;
   - a note: "Other sizes and grades made to your drawing."
5. **Customisation** (white): what can be changed (dimensions, grade, density, finish, packing), plus a
   link to `/custom-ceramic-fibre-shapes/`.
6. **Quality** (carbon): the QualityChecks list and "Test report available with every order."
7. **FAQ** (white): 4–6 questions written for long-tail search (see §6).
8. **Related products** (paper): 3 cards from the same family, or from `related`.
9. RfqBand.
There is **no** "how it's made" section, ever.

### Family page `/products/<family>/`
Hero (carbon, without the ruler) with H1 and a 60–80 word intro → product grid → a 150–250 word SEO
paragraph on how to choose within the family → FAQ (3–4) → RfqBand.

### Custom ceramic fibre shapes `/custom-ceramic-fibre-shapes/`
- H1 "Custom ceramic fibre shapes, made to your drawing."
- **What we make to order:** a gallery of example custom parts (placeholders until photos arrive).
- **What to send:** a drawing (PDF/DWG/DXF/STEP), a sample part, or dimensions with the application.
- **What we need to quote:** size, quantity, operating temperature, and the metal or gas the part
  meets. Tolerances are `[[TODO]]`.
- A confidentiality statement for drawings.
- The full RfqForm with the product pre-set to "Custom shape".

### Plant & Quality `/plant-and-quality/`
- **The plant:** photos, address, capacity and area figures from `site.ts`. Nothing about the forming
  method.
- **Quality checks:** a table of check, method or instrument, and frequency (`[[TODO]]` until confirmed).
- **Certificates:** ISO, if held, with the certificate number, issuing body and a PDF link.
- **Test report:** available with every order, on request.
- **Packing & dispatch:** cartons, pallets, labelling, and delivery within India. Export is mentioned only if approved.

### Industries `/industries/<slug>/`
H1 (e.g. "Ceramic fibre products for iron foundries") → 3 problems the buyer has, each answered with
the product that solves it → a grid of the products used → FAQ (2–3) → RfqBand.
Each page runs 400–600 words and uses no invented case studies.

### About `/about/`
Story (founding year, founders or leadership if they want names shown), what Innovac makes, who it
serves, and company facts in a mono table: legal name, year, GSTIN, CIN, plant address. Then a map facade.

### Downloads `/downloads/`
Ungated PDFs: datasheet per product, company profile, certificates. It can be filtered by family, with a
tiny island or `:has()` CSS. Each row shows the title, type, size and revision date. If a datasheet
doesn't exist yet, the row says "Available on request" and links to the RFQ.

### Request a quote `/request-a-quote/` and the inline form
Fields (only 3 are required: **Name, Phone, Product**):
- Product * (select: 10 products + Custom shape + Other; pre-filled from `?product=`)
- Quantity (text, placeholder "e.g. 2,000 pcs / month")
- Name *, Company
- Phone * (+91 default; checkbox "Reply on WhatsApp is fine", ticked by default)
- Email
- Delivery city / country
- Drawing or photo (multiple files; PDF, DWG, DXF, STEP, STP, JPG, PNG; 25MB total)
- Details (textarea: metal and pour temperature, sizes, application)
- A hidden honeypot field (Web3Forms `botcheck`)
- Consent line with a link to the privacy page. Submit button: "Request quote".

**Flow:**
1. The browser validates the fields and creates a reference number (`INV-YYMMDD-XXXX`).
2. The form posts to Web3Forms with the fields, the reference, and the page the buyer came from.
   Web3Forms emails sales (and can send the buyer an auto-reply).
3. On success it redirects to `/thank-you/?ref=…`.
4. Drawing uploads need a paid Web3Forms plan. Until that is decided, buyers send drawings on WhatsApp or
   by email (see build-plan Phase 6).

**Errors:** inline, per field. If the API fails, show the error and the WhatsApp alternative, and never
lose what the buyer typed.

**Retention:** if uploads are enabled, delete uploaded files after 180 days. The privacy page says so.

## 4. SEO strategy

### 4.1 Positioning
Rank for **"[product] manufacturer in India"** and **"[product] for foundry"** searches. These are
buying-intent terms with modest volume, and the competition is mostly thin IndiaMART listings and
Chinese exporter blogs. Innovac wins with real product pages, real photos and fast pages.

**Spelling:** India and the UK write "fibre" and the US writes "fiber", and buyers search both. Use
"fibre" in visible copy. Work "fiber" in naturally once per product page: in one FAQ answer and in the
image alt text of the studio photo (e.g. "ceramic fiber sampling spoon – studio photo"). Don't
keyword-stuff.

### 4.2 Keyword map
Volumes are unverified. Validate in Google Keyword Planner before launch and in Search Console
after 6–8 weeks.

| Page | Primary | Secondary |
|---|---|---|
| Home | ceramic fibre products manufacturer India | foundry consumables manufacturer, ceramic fibre shapes Hyderabad |
| Foundry consumables | foundry consumables manufacturer India | foundry consumables supplier, foundry refractory consumables |
| Sampling spoons | ceramic fibre sampling spoon | sampling spoon for foundry, molten metal sampling spoon, ceramic fiber sampling spoon |
| Tap-out cones | tap out cone manufacturer | ceramic fibre tap out cone, tap hole cone for furnace |
| Pouring cups | pouring cup for foundry | ceramic fibre pouring cup, pouring basin |
| Sleeves | exothermic sleeves manufacturer India | insulating feeder sleeve, riser sleeve for casting |
| Crucibles | foundry crucible manufacturer | crucible for melting, [[TODO: material type once confirmed]] crucible |
| Hot gas filtration | hot gas filtration ceramic | high temperature gas filtration |
| Filter candles | ceramic filter candles | hot gas filter candle, ceramic fibre filter candle manufacturer |
| Thermal insulation | ceramic fibre insulation manufacturer | high temperature insulation products India |
| Boards | ceramic fibre board manufacturer India | ceramic fiber board, refractory insulation board |
| Pipe sections | ceramic fibre pipe section | high temperature pipe insulation |
| Gaskets | ceramic fibre gasket | high temperature gasket for furnace door |
| Burner shapes | burner block ceramic fibre | burner quarl, burner shapes |
| Custom shapes | custom ceramic fibre shapes | ceramic fibre shapes made to drawing, special ceramic fibre shapes |
| Plant & Quality | ceramic fibre products manufacturer Hyderabad | — |
| Industries | ceramic fibre products for [industry] | foundry consumables for steel plants |

### 4.3 On-page rules (apply to every page, in the `Seo` component)
- `<title>`: 50–60 characters, primary keyword first, with `| Innovac Ceramic` at the end.
  Home: "Ceramic Fibre & Foundry Consumables Manufacturer | Innovac".
  Product template: "{Product} Manufacturer in India | Innovac Ceramic". Shorten when it's too long.
- Meta description: 140–155 characters. Say what it is, who it's for, and end with "Request a quote."
- One H1 per page containing the primary keyword. H2s describe sections in plain words.
- The first 100 words of body copy include the primary keyword once.
- Canonical URL on every page. `lang="en-IN"`. OG and Twitter tags, with a 1200×630 OG image generated
  per page at build time (carbon background, wordmark, page title in Barlow Condensed, a flame rule line).
- Image alt text is descriptive and names the product. Photos that sit next to text saying the same
  thing are decorative and get `alt=""`.
- Internal links: every product links to its family, 3 related products, custom shapes and one industry.
  Every industry page links to the products it uses. Family pages link to all their products.
- **No forming-process words anywhere** (enforced by `lint-copy`).

### 4.4 Structured data (JSON-LD, built in `src/lib/seo.ts`)
- **Site-wide:** `Organization` (name, legalName, url, logo, contactPoint with telephone, email and
  areaServed "IN", sameAs linking the LinkedIn, IndiaMART and Google Business Profile URLs) plus a
  `LocalBusiness` with the plant `PostalAddress`, `geo` and `openingHours`.
- **Product pages:** `Product` with name, description, image, `brand` and `manufacturer` set to the
  Organization, `category`, and `material` when known. **No `offers`, prices or ratings:** don't invent
  them. Google shows no rich result without offers, which is expected; the markup still helps
  search engines and AI assistants understand the page.
- `BreadcrumbList` on every inner page.
- FAQ content stays on the page as HTML. `FAQPage` markup is optional: since 2023 Google shows FAQ rich
  results only for government and health sites, so don't expect snippets from it.

### 4.5 Technical SEO
- Pages are statically generated, with `@astrojs/sitemap` (excluding `/styleguide/`, `/thank-you/` and `/404`)
  and a `robots.txt` that points to the sitemap.
- **Redirects** from the old Hostinger site, configured in `astro.config.mjs` `redirects` (see §5).
  GitHub Pages can't send server 301s, so Astro writes a redirect page per old URL (meta refresh plus a
  canonical link), which Google treats as a permanent redirect.
- Core Web Vitals budgets, measured on a mobile 4G profile:
  - LCP < 2.0s
  - CLS < 0.05
  - INP < 200ms
  - Page JS < 30KB gzipped (the RFQ page < 60KB)
  - Hero image < 180KB
  - Lighthouse ≥ 95 in all four categories
- Only one domain version: `https://innovacceramic.com/` (no www). GitHub Pages redirects www and http
  once the custom domain and Enforce HTTPS are set (build-plan Phase 9).

### 4.6 Launch and off-page
1. **Search Console:** verify the domain. Check **Security issues** and **Manual actions**, because the old site
   may have had injected casino spam. Submit the sitemap. Use URL Inspection → Request indexing for the
   home page and the 10 product pages.
2. **Bing Webmaster Tools:** import from Search Console.
3. **Google Business Profile** for the plant: category "Manufacturer", the same name, address and phone (NAP)
   as the site, photos, and products added. This is the biggest win for "near me" and Hyderabad searches.
4. **Consistent NAP and product names** across IndiaMART, TradeIndia, JustDial and the LinkedIn company
   page, all linking to the matching product URL.
5. **Associations and directories:** Institute of Indian Foundrymen (IIF) member directory, and regional
   foundry clusters (Coimbatore, Kolhapur, Rajkot, Belgaum). Links from these carry weight.
6. **Measurement:** Cloudflare Web Analytics (cookie-less) plus these events, all sent via `data-event`
   attributes and a tiny script: `rfq_submit`, `whatsapp_click`, `phone_click`, `email_click`,
   `download`. Add GA4 later only if needed.

## 5. Redirect map (old URLs → new)
`/about`, `/products` and `/contact` need no entry: GitHub Pages already redirects them to the
trailing-slash pages.
```
/about-us         → /about/
/crucibles        → /products/crucibles/
/tap-out-cones    → /products/tap-out-cones/
/sleeves          → /products/insulating-exothermic-sleeves/
/boards           → /products/ceramic-fibre-boards/
/pouring-cups     → /products/pouring-cups/
/gasket           → /products/ceramic-fibre-gaskets/
/pipe-section     → /products/ceramic-fibre-pipe-sections/
/shapes-for-burner-applications → /products/burner-shapes/
/high-temperature-ceramic-insulation            → /products/thermal-insulation/
/high-temperature-ceramic-insulation-1          → /products/thermal-insulation/
/high-temperature-ceramic-insulation-products   → /products/thermal-insulation/
/high-temperature-ceramic-insulation-products-1 → /products/thermal-insulation/
/high-temperature-ceramic-insulation-products-2 → /products/thermal-insulation/
/high-temp-ceramic-insulation-products          → /products/thermal-insulation/
```

## 6. Content model (`src/content.config.ts`)

**products** (markdown with frontmatter):
```ts
{
  title: string,              // "Ceramic fibre sampling spoons"
  shortName: string,          // "Sampling spoons" (cards, nav, select)
  family: 'foundry-consumables' | 'hot-gas-filtration' | 'thermal-insulation',
  order: number,
  summary: string,            // ≤ 140 chars, card and hero
  seo: { title: string, description: string, primaryKeyword: string },
  keyFacts: { label: string, value: string }[] | null,   // max 3, optional
  applications: string[],
  customisation: string[],
  specs: { property: string, value: string | null, method?: string }[] | null,
  sizes: { columns: string[], rows: string[][] } | null,
  faqs: { q: string, a: string }[],        // 4–6
  images: { hero?: ImageMetadata, gallery: ImageMetadata[], placeholder: string },
  datasheet: string | null,   // /downloads/… pdf
  industries: string[],       // industry slugs
  related: string[],          // product slugs; validated at build
  draft: boolean
}
```
The body holds the "What it does" copy (2–3 short paragraphs).

**families:** title, letter (A/B/C), intro, seoCopy (markdown body), faqs, seo, order.
**industries:** title, shortName, problems `{problem, answer, products[]}[]`, faqs, seo, order.
**downloads:** a YAML list of `{ title, type: 'datasheet'|'profile'|'certificate', family?, file, sizeKB, revised }`.

**`src/data/site.ts`** is the single source of company facts: legal name, brand, phone (one number),
WhatsApp number, email (on the domain), plant address, geo, hours, GSTIN, CIN, founded year, capacity,
plants supplied, certificates, quoteReplyTime, qualityChecks[], social URLs, `arivo.linkFromInnovac`
(default `false`). Every missing value is `null` and prints as a `[[TODO]]` in dev and nothing in
production, so a placeholder never ships.

**Build-time validation** fails the build if:
- a `related` or `industries` slug doesn't resolve;
- a product has fewer than 4 FAQs;
- `seo.title` is over 60 characters or `seo.description` is over 160;
- a product has `draft: false` while still containing `[[TODO` in its body.

## 7. Phase 2 content: Insights (one article a month)
Each article runs 800–1,200 words, is practical, is written from the maker's view, and links to 2 product pages.
1. How to choose a sampling spoon for iron and steel foundries
2. Tap-out cones: matching cone size to the tap hole
3. Insulating vs exothermic feeder sleeves: when to use which
4. Ceramic filter candles vs bag filters for hot gas
5. Ceramic fibre board grades explained
6. Ordering custom ceramic fibre shapes: what to send with your drawing
