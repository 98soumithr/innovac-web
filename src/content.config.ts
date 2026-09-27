// Content model (site-plan §6). Cross-collection checks run in src/lib/validate.ts at build time.
import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

export const FAMILY_SLUGS = ['foundry-consumables', 'hot-gas-filtration', 'thermal-insulation'] as const;

const seo = z.object({
  title: z.string().max(60, 'seo.title must be 60 characters or fewer'),
  description: z.string().max(160, 'seo.description must be 160 characters or fewer'),
  primaryKeyword: z.string(),
});

const faq = z.object({ q: z.string(), a: z.string() });

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(), // "Ceramic fibre sampling spoons"
      shortName: z.string(), // "Sampling spoons" (cards, nav, select)
      family: z.enum(FAMILY_SLUGS),
      order: z.number(),
      summary: z.string().max(140),
      seo,
      keyFacts: z.array(z.object({ label: z.string(), value: z.string() })).max(3).nullable().default(null),
      applications: z.array(z.string()),
      customisation: z.array(z.string()),
      specs: z
        .array(z.object({ property: z.string(), value: z.string().nullable(), method: z.string().optional() }))
        .nullable()
        .default(null),
      sizes: z.object({ columns: z.array(z.string()), rows: z.array(z.array(z.string())) }).nullable().default(null),
      faqs: z.array(faq).min(4, 'a product needs at least 4 FAQs').max(6),
      images: z.object({
        hero: image().optional(),
        gallery: z.array(image()).default([]),
        placeholder: z.string(), // what the studio photo must show
      }),
      datasheet: z.string().nullable().default(null),
      industries: z.array(z.string()),
      related: z.array(z.string()),
      draft: z.boolean().default(false),
    }),
});

const families = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/families' }),
  schema: z.object({
    title: z.string(),
    letter: z.enum(['A', 'B', 'C']),
    intro: z.string(), // 60–80 words
    faqs: z.array(faq).min(3).max(4),
    seo,
    order: z.number(),
  }),
});

const industries = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/industries' }),
  schema: z.object({
    title: z.string(), // H1, e.g. "Ceramic fibre products for iron foundries"
    shortName: z.string(), // tile title, e.g. "Grey & SG iron foundries"
    tileProducts: z.string(), // "Spoons · cones · cups · sleeves"
    problems: z.array(z.object({ problem: z.string(), answer: z.string(), products: z.array(z.string()) })).length(3),
    faqs: z.array(faq).min(2).max(3),
    seo,
    order: z.number(),
  }),
});

const downloads = defineCollection({
  loader: file('./src/content/downloads.yaml'),
  schema: z.object({
    title: z.string(),
    type: z.enum(['datasheet', 'profile', 'certificate']),
    family: z.enum(FAMILY_SLUGS).optional(),
    file: z.string().nullable(), // /downloads/… ; null = "Available on request"
    sizeKB: z.number().optional(),
    revised: z.string().optional(),
  }),
});

export const collections = { products, families, industries, downloads };
