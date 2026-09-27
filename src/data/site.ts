/**
 * Company facts: the single source of truth (site-plan §6).
 *
 * Every value Innovac hasn't confirmed is `null`. Templates render it with `fact()` / `todo()`, which
 * print a visible `[[TODO: …]]` in dev and on the github.io preview, and nothing in the launch build,
 * so a placeholder never ships. Never fill a field with a guess (CLAUDE.md rule 3).
 */

export interface PostalAddress {
  street: string;
  locality: string; // area / village
  city: string;
  region: string; // state
  postalCode: string;
  country: string;
}

export interface Certificate {
  name: string; // "ISO 9001:2015"
  number: string;
  issuedBy: string;
  pdf: string | null; // /downloads/… pdf
}

export interface QualityCheck {
  label: string; // "Bulk density"
  method: string | null; // instrument or standard
  frequency: string | null; // "Every batch"
}

export interface Site {
  brand: string;
  legalName: string | null;
  phone: string | null; // display format, e.g. "+91 98xxx xxxxx"
  phoneE164: string | null; // "+9198xxxxxxxx", used for tel: links
  whatsappE164: string | null; // "+9198xxxxxxxx"
  email: string | null; // on the domain, e.g. sales@innovacceramic.com
  address: PostalAddress | null;
  mapsUrl: string | null;
  geo: { lat: number; lng: number } | null;
  hours: string | null; // "Mon–Sat, 9:00–18:00"
  gstin: string | null;
  cin: string | null;
  foundedYear: number | null;
  capacity: { value: string; unit: string } | null; // { value: "50,000", unit: "pcs / month" }
  plantsSupplied: string | null; // "120+"
  productLines: number | null;
  certificates: Certificate[];
  quoteReplyTime: string | null; // "Within 1 working day"
  qualityChecks: QualityCheck[];
  social: {
    linkedin: string | null;
    indiamart: string | null;
    googleBusiness: string | null;
  };
  arivo: { linkFromInnovac: boolean };
}

export const site: Site = {
  brand: 'Innovac Ceramic',
  legalName: 'Innovac Ceramic Pvt Ltd',
  phone: null,
  phoneE164: null,
  whatsappE164: null,
  email: null,
  address: null,
  mapsUrl: null,
  geo: null,
  hours: null,
  gstin: null,
  cin: null,
  foundedYear: null,
  capacity: null,
  plantsSupplied: null,
  productLines: null,
  certificates: [],
  quoteReplyTime: null,
  qualityChecks: [],
  social: {
    linkedin: null,
    indiamart: null,
    googleBusiness: null,
  },
  arivo: { linkFromInnovac: false },
};

/** Show `[[TODO]]` markers in dev and on the preview build; hide them in the launch build. */
export const SHOW_TODOS: boolean =
  import.meta.env.DEV || import.meta.env.PUBLIC_SHOW_TODOS === 'true';

/** A placeholder for a missing fact, or `null` when TODOs are hidden. */
export function todo(what: string): string | null {
  return SHOW_TODOS ? `[[TODO: ${what}]]` : null;
}

/** True for a `[[TODO: …]]` placeholder string, so components can set it small instead of at display size. */
export function isTodo(value: unknown): boolean {
  return typeof value === 'string' && value.startsWith('[[TODO');
}

/** The value if known, otherwise a TODO placeholder (or `null` in the launch build). */
export function fact<T>(value: T | null | undefined, what: string): T | string | null {
  return value ?? todo(what);
}
