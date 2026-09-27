import { getCollection, type CollectionEntry } from 'astro:content';
import { SHOW_TODOS } from '../data/site';

export type Product = CollectionEntry<'products'>;
export type Family = CollectionEntry<'families'>;
export type Industry = CollectionEntry<'industries'>;

/**
 * Draft products (still holding [[TODO]]s) are built in dev and on the preview, and left out of the
 * launch build until their facts are filled in.
 */
export async function getProducts(): Promise<Product[]> {
  const products = await getCollection('products', (p) => SHOW_TODOS || !p.data.draft);
  const families = await getFamilies();
  const familyOrder = new Map(families.map((f) => [f.id, f.data.order]));
  return products.sort(
    (a, b) => (familyOrder.get(a.data.family) ?? 0) - (familyOrder.get(b.data.family) ?? 0) || a.data.order - b.data.order,
  );
}

export async function getFamilies(): Promise<Family[]> {
  return (await getCollection('families')).sort((a, b) => a.data.order - b.data.order);
}

export async function getIndustries(): Promise<Industry[]> {
  return (await getCollection('industries')).sort((a, b) => a.data.order - b.data.order);
}

export async function getProductsByFamily(): Promise<{ family: Family; products: Product[] }[]> {
  const [families, products] = await Promise.all([getFamilies(), getProducts()]);
  return families.map((family) => ({ family, products: products.filter((p) => p.data.family === family.id) }));
}

export const productPath = (slug: string) => `/products/${slug}/`;
export const industryPath = (slug: string) => `/industries/${slug}/`;
