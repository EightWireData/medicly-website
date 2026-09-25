import { getCollection } from 'astro:content';

/** All blog posts, newest first (the Webflow lists were sorted by date). */
export async function getPosts() {
  return (await getCollection('blog')).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** The single post Webflow showed under "TOP POSTS" in the blog sidebar. */
export const TOP_POST = 'sharing-data-securely-fast-tracks-better-health-outcomes';
