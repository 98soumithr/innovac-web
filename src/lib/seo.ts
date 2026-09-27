// JSON-LD builders (site-plan §4.4). Only facts present in site.ts are emitted — nothing is invented,
// and Product never carries offers, prices or ratings.
import { site } from '../data/site';
import { url } from './paths';

const abs = (path: string, base: URL) => new URL(url(path), base).href;
const orgId = (base: URL) => `${abs('/', base)}#organization`;

export function organizationLd(base: URL) {
  const sameAs = Object.values(site.social).filter(Boolean);
  const contactPoint =
    site.phoneE164 || site.email
      ? {
          '@type': 'ContactPoint',
          contactType: 'sales',
          areaServed: 'IN',
          ...(site.phoneE164 ? { telephone: site.phoneE164 } : {}),
          ...(site.email ? { email: site.email } : {}),
        }
      : undefined;
  const address = site.address
    ? {
        '@type': 'PostalAddress',
        streetAddress: [site.address.street, site.address.locality].filter(Boolean).join(', '),
        addressLocality: site.address.city,
        addressRegion: site.address.region,
        postalCode: site.address.postalCode,
        addressCountry: site.address.country,
      }
    : undefined;

  const organization = {
    '@type': 'Organization',
    '@id': orgId(base),
    name: site.brand,
    ...(site.legalName ? { legalName: site.legalName } : {}),
    url: abs('/', base),
    logo: abs('/og/home.png', base),
    ...(contactPoint ? { contactPoint } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
  // LocalBusiness only once there is an address to anchor it.
  const localBusiness = address
    ? {
        '@type': 'LocalBusiness',
        '@id': `${abs('/', base)}#plant`,
        name: site.legalName ?? site.brand,
        parentOrganization: { '@id': orgId(base) },
        url: abs('/', base),
        image: abs('/og/home.png', base),
        address,
        ...(site.phoneE164 ? { telephone: site.phoneE164 } : {}),
        ...(site.geo ? { geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng } } : {}),
        ...(site.hours ? { openingHours: site.hours } : {}),
      }
    : undefined;

  return { '@context': 'https://schema.org', '@graph': [organization, ...(localBusiness ? [localBusiness] : [])] };
}

export function productLd(
  base: URL,
  p: { slug: string; name: string; description: string; category: string; image?: string },
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.description,
    url: abs(`/products/${p.slug}/`, base),
    image: p.image ?? abs(`/og/products/${p.slug}.png`, base),
    category: p.category,
    brand: { '@id': orgId(base) },
    manufacturer: { '@id': orgId(base) },
  };
}
