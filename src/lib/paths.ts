/**
 * Every internal link and asset URL goes through `url()`, so the site works both under the
 * github.io preview base (`/innovac-web/`) and at `/` after launch.
 *
 *   url('/products/')          → '/innovac-web/products/'
 *   url('/products/#family-a') → '/innovac-web/products/#family-a'
 */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function url(path: string): string {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${BASE}${clean}`;
}

/** True when `href` (a `url()` result) is the page being rendered, ignoring the hash. */
export function isCurrent(href: string, pathname: string): boolean {
  const target = href.split('#')[0];
  return target === pathname || (target !== `${BASE}/` && pathname.startsWith(target));
}
