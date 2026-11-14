import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * One Markdown file per project in src/content/projects/.
 * Frontmatter is the spec sheet; the Markdown body is the
 * "Engineering approach" narrative shown in the drawer.
 */
const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** One line. Shown on cards and rows. */
      summary: z.string().max(160),
      year: z.number().int(),
      /** Two-digit sequence used in the spec ID (DP-25-01) and for ordering within a year. */
      order: z.number().int().default(99),
      /** Free text for the archive table's Domain column. */
      domain: z.string(),
      /** Drives the filter bar. A project can sit in more than one. */
      categories: z.array(z.enum(['hardware', 'failure', 'software'])).min(1),
      /** Which numbered section owns the project. */
      section: z.enum(['engineering', 'software', 'seva']),
      /** Featured projects appear as cards in 01. Selected Builds. */
      featured: z.boolean().default(false),
      tools: z.array(z.string()).min(1),

      role: z.string().optional(),
      duration: z.string().optional(),
      status: z.string().optional(),

      objective: z.string(),
      outcome: z.string().optional(),
      metrics: z.array(z.object({ value: z.string(), label: z.string() })).default([]),

      cover: image(),
      coverAlt: z.string(),
      gallery: z
        .array(z.object({ src: image(), alt: z.string(), caption: z.string().optional() }))
        .default([]),

      draft: z.boolean().default(false),
    }),
});

export const collections = { projects };
