import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const conditionsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/conditions' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    category: z.string(), // musculoskeletal, mental-health, respiratory, cardiovascular, etc.
    commonRatings: z.array(z.string()).default([]),
    keywords: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    tags: z.array(z.string()).default([]),
    author: z.string().default('VA Claim Hub Team'),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  conditions: conditionsCollection,
  blog: blogCollection,
};
