/**
 * TEMPORARY homepage copy, taken verbatim from the approved mockup
 * (docs/reference/homepage-mockup.html). Phase 4 moves products, families and industries into
 * src/content/** and the homepage reads them from there. Do not add facts here.
 */

export interface HomeProduct {
  slug: string;
  name: string;
  summary: string;
}

export interface HomeFamily {
  letter: 'A' | 'B' | 'C';
  slug: string;
  title: string;
  products: HomeProduct[];
}

export const families: HomeFamily[] = [
  {
    letter: 'A',
    slug: 'foundry-consumables',
    title: 'Foundry consumables',
    products: [
      { slug: 'ceramic-fibre-sampling-spoons', name: 'Sampling spoons', summary: 'Clean molten-metal samples for lab analysis.' },
      { slug: 'tap-out-cones', name: 'Tap-out cones', summary: 'Reliable tap-hole sealing and clean release.' },
      { slug: 'pouring-cups', name: 'Pouring cups', summary: 'Steady, controlled pour into the mould.' },
      { slug: 'insulating-exothermic-sleeves', name: 'Feeder sleeves', summary: 'Insulating and exothermic, for better yield.' },
      { slug: 'crucibles', name: 'Crucibles', summary: 'For melting and holding in the foundry.' },
    ],
  },
  {
    letter: 'B',
    slug: 'hot-gas-filtration',
    title: 'Hot gas filtration',
    products: [
      { slug: 'ceramic-filter-candles', name: 'Filter candles', summary: 'Dust removal from hot process and flue gas.' },
    ],
  },
  {
    letter: 'C',
    slug: 'thermal-insulation',
    title: 'Thermal insulation',
    products: [
      { slug: 'ceramic-fibre-boards', name: 'Boards', summary: 'Rigid hot-face and backup lining.' },
      { slug: 'ceramic-fibre-pipe-sections', name: 'Pipe sections', summary: 'Insulation for hot pipes and ducts.' },
      { slug: 'ceramic-fibre-gaskets', name: 'Gaskets', summary: 'High-temperature seals for doors and flanges.' },
      { slug: 'burner-shapes', name: 'Burner shapes', summary: 'Blocks and quarls for burner openings.' },
    ],
  },
];

export const filtrationFeature = {
  title: 'Clean gas at temperatures bag filters can’t take',
  text: 'Candles supplied to your length, diameter and flange detail for new housings and replacements.',
  applications: [
    'Glass furnaces',
    'Cement & lime kilns',
    'Biomass & boilers',
    'Incinerators',
    'Metal processing off-gas',
  ],
};

export const industries = [
  { slug: 'iron-foundries', title: 'Grey & SG iron foundries', products: 'Spoons · cones · cups · sleeves' },
  { slug: 'steel-foundries-and-steel-plants', title: 'Steel foundries & steel plants', products: 'Spoons · sleeves · boards' },
  { slug: 'non-ferrous-foundries', title: 'Non-ferrous foundries', products: 'Crucibles · cones · cups' },
  { slug: 'glass-cement-and-process-plants', title: 'Glass, cement & process plants', products: 'Filter candles · insulation' },
  { slug: 'furnace-and-kiln-builders', title: 'Furnace & kiln builders', products: 'Boards · gaskets · burner shapes · custom' },
];

/** RFQ product select: the 10 products + Custom shape + Other (site-plan §3). */
export const rfqProducts: { value: string; label: string }[] = [
  ...families.flatMap((f) => f.products.map((p) => ({ value: p.slug, label: p.name }))),
  { value: 'custom-shape', label: 'Custom shape' },
  { value: 'other', label: 'Other' },
];
