import { getCollection } from 'astro:content';
import { SHOW_TODOS } from '../data/site';

/**
 * Cross-collection checks that zod can't express (site-plan §6). Called from getStaticPaths, so a
 * broken reference or an unfinished published product fails the build.
 */
let done = false;

export async function validateContent(): Promise<void> {
  if (done) return;
  done = true;
  const [products, families, industries] = await Promise.all([
    getCollection('products'),
    getCollection('families'),
    getCollection('industries'),
  ]);
  const productIds = new Set(products.map((p) => p.id));
  const familyIds = new Set(families.map((f) => f.id));
  const industryIds = new Set(industries.map((i) => i.id));
  const errors: string[] = [];

  for (const p of products) {
    if (!familyIds.has(p.data.family)) errors.push(`${p.id}: family "${p.data.family}" has no file in src/content/families`);
    for (const r of p.data.related) if (!productIds.has(r)) errors.push(`${p.id}: related "${r}" is not a product`);
    for (const i of p.data.industries) if (!industryIds.has(i)) errors.push(`${p.id}: industry "${i}" is not an industry`);
    if (p.data.related.includes(p.id)) errors.push(`${p.id}: lists itself as related`);
    if (!p.data.draft && /\[\[TODO/.test(p.body ?? '')) errors.push(`${p.id}: draft is false but the body still has [[TODO]]`);
  }
  // Families and industries have no draft flag, so the launch build must not carry placeholders.
  if (!SHOW_TODOS) {
    for (const e of [...families, ...industries])
      if (/\[\[TODO/.test(`${e.body ?? ''}${JSON.stringify(e.data)}`)) errors.push(`${e.id}: still has [[TODO]] (launch build)`);
  }
  for (const i of industries) {
    for (const prob of i.data.problems)
      for (const s of prob.products) if (!productIds.has(s)) errors.push(`industry ${i.id}: product "${s}" is not a product`);
  }
  if (errors.length) throw new Error(`Content validation failed:\n  ${errors.join('\n  ')}`);
}
