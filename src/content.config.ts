import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Former Webflow CMS collections. Add a post by dropping a Markdown file into src/content/blog/.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      date: z.coerce.date(),
      author: reference('team'),
      category: reference('categories'),
      image: image(),
    }),
});

const team = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/team' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      photo: image(),
      /** Background colour behind the cut-out photo. */
      background: z.string(),
      linkedin: z.string().url(),
    }),
});

const jobs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/jobs' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    jobTitle: z.string(),
    location: z.string(),
    basis: z.string(),
  }),
});

const categories = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/categories' }),
  schema: z.object({ name: z.string() }),
});

export const collections = { blog, team, jobs, categories };
