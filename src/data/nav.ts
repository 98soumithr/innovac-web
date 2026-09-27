export interface NavLink {
  label: string;
  href: string; // path without base; pass through url()
}

export const mainNav: NavLink[] = [
  { label: 'Products', href: '/products/' },
  { label: 'Custom shapes', href: '/custom-ceramic-fibre-shapes/' },
  { label: 'Plant & Quality', href: '/plant-and-quality/' },
  { label: 'Industries', href: '/industries/' },
  { label: 'Downloads', href: '/downloads/' },
  { label: 'Contact', href: '/contact/' },
];

export const quoteLink: NavLink = { label: 'Request a quote', href: '/request-a-quote/' };

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: 'Products',
    links: [
      { label: 'Foundry consumables', href: '/products/foundry-consumables/' },
      { label: 'Hot gas filtration', href: '/products/hot-gas-filtration/' },
      { label: 'Thermal insulation', href: '/products/thermal-insulation/' },
      { label: 'Custom shapes', href: '/custom-ceramic-fibre-shapes/' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Plant & Quality', href: '/plant-and-quality/' },
      { label: 'Industries', href: '/industries/' },
      { label: 'Downloads', href: '/downloads/' },
      { label: 'Contact', href: '/contact/' },
    ],
  },
  {
    title: 'Downloads',
    links: [
      { label: 'Datasheets', href: '/downloads/' },
      { label: 'Company profile', href: '/downloads/' },
      { label: 'Certificates', href: '/downloads/' },
    ],
  },
];
